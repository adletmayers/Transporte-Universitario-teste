const express = require('express');
const router = express.Router();

const db = require('../config/database');

/*
========================================
LISTAR TODAS AS RESERVAS
========================================
*/

router.get('/', async (req, res) => {

    try {

        const resultado = await db.query(
            `
            SELECT *
            FROM reservas
            ORDER BY id
            `
        );

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
LISTAR RESERVAS DE UM USUÁRIO
========================================
*/

router.get('/usuario/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await db.query(
            `
            SELECT *
            FROM reservas
            WHERE usuario_id = $1
            ORDER BY id DESC
            `,
            [id]
        );

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
CRIAR RESERVA
========================================
*/

router.post('/', async (req, res) => {

    try {

        const {
            usuario_id,
            rota_id
        } = req.body;

        if (!usuario_id || !rota_id) {

            return res.status(400).json({
                erro: 'Informe usuário e rota'
            });

        }

        const usuario = await db.query(
            `
            SELECT id
            FROM usuarios
            WHERE id = $1
            `,
            [usuario_id]
        );

        if (usuario.rows.length === 0) {

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });

        }

        const rota = await db.query(
            `
            SELECT id
            FROM rotas
            WHERE id = $1
            `,
            [rota_id]
        );

        if (rota.rows.length === 0) {

            return res.status(404).json({
                erro: 'Rota não encontrada'
            });

        }

        const reservaExistente = await db.query(
            `
            SELECT id
            FROM reservas
            WHERE usuario_id = $1
            AND rota_id = $2
            `,
            [
                usuario_id,
                rota_id
            ]
        );

        if (reservaExistente.rows.length > 0) {

            return res.status(400).json({
                erro: 'Você já possui reserva nesta rota'
            });

        }

        const novaReserva = await db.query(
            `
            INSERT INTO reservas
            (
                usuario_id,
                rota_id
            )
            VALUES
            (
                $1,
                $2
            )
            RETURNING *
            `,
            [
                usuario_id,
                rota_id
            ]
        );

        res.status(201).json({
            mensagem: 'Reserva realizada com sucesso',
            reserva: novaReserva.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
CANCELAR RESERVA
========================================
*/

router.delete('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const reserva = await db.query(
            `
            SELECT id
            FROM reservas
            WHERE id = $1
            `,
            [id]
        );

        if (reserva.rows.length === 0) {

            return res.status(404).json({
                erro: 'Reserva não encontrada'
            });

        }

        await db.query(
            `
            DELETE FROM reservas
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensagem: 'Reserva cancelada com sucesso'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

module.exports = router;