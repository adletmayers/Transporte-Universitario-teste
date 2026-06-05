const express = require('express');
const router = express.Router();
const db = require('../config/database');

/*
========================================
REALIZAR COMPRA
========================================
*/

router.post('/', async (req, res) => {

    try {

        const {
            usuario_id,
            viagem_id,
            assento_numero,
            valor,
            forma_pagamento
        } = req.body;

        if (
            !usuario_id ||
            !viagem_id ||
            !assento_numero ||
            !valor ||
            !forma_pagamento
        ) {

            return res.status(400).json({
                erro: 'Preencha todos os campos'
            });

        }

        // Verifica se o assento existe

        const assento = await db.query(
            `
            SELECT *
            FROM assentos
            WHERE viagem_id = $1
            AND numero = $2
            `,
            [
                viagem_id,
                assento_numero
            ]
        );

        if (assento.rows.length === 0) {

            return res.status(404).json({
                erro: 'Assento não encontrado'
            });

        }

        // Verifica se já está ocupado

        if (assento.rows[0].ocupado) {

            return res.status(400).json({
                erro: 'Assento já ocupado'
            });

        }
        const compraExistente = await db.query(
            `
            SELECT id
            FROM compras
            WHERE usuario_id = $1
            AND viagem_id = $2
            `,
            [
                usuario_id,
                viagem_id
            ]
            );

            if(compraExistente.rows.length > 0){

                return res.status(400).json({
                    erro:'Você já possui passagem para esta viagem'
                });

}

        // Salva compra

        const compra = await db.query(
            `
            INSERT INTO compras
            (
                usuario_id,
                viagem_id,
                assento_numero,
                valor,
                forma_pagamento
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING *
            `,
            [
                usuario_id,
                viagem_id,
                assento_numero,
                valor,
                forma_pagamento
            ]
        );

        // Ocupa assento

        await db.query(
            `
            UPDATE assentos
            SET ocupado = TRUE
            WHERE viagem_id = $1
            AND numero = $2
            `,
            [
                viagem_id,
                assento_numero
            ]
        );

        // Atualiza vagas disponíveis

        await db.query(
            `
            UPDATE viagens
            SET vagas_disponiveis = GREATEST(
                vagas_disponiveis - 1,
                0
            )
            WHERE id = $1
            `,
            [viagem_id]
        );

        res.status(201).json({
            mensagem: 'Compra realizada com sucesso',
            compra: compra.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
HISTÓRICO DE COMPRAS
========================================
*/

router.get('/:usuarioId', async (req, res) => {

    try {

        const { usuarioId } = req.params;

        const resultado = await db.query(
            `
            SELECT
                c.*,
                v.origem,
                v.destino,
                v.data_ida,
                v.horario_saida,
                v.horario_chegada
            FROM compras c
            JOIN viagens v
                ON v.id = c.viagem_id
            WHERE c.usuario_id = $1
            ORDER BY c.created_at DESC
            `,
            [usuarioId]
        );

        res.json(resultado.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: err.message
        });

    }

});

/*
========================================
CANCELAR COMPRA
========================================
*/

router.delete('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const compra = await db.query(
            `
            SELECT *
            FROM compras
            WHERE id = $1
            `,
            [id]
        );

        if (compra.rows.length === 0) {

            return res.status(404).json({
                erro: 'Compra não encontrada'
            });

        }

        const dadosCompra = compra.rows[0];

        // Libera assento

        await db.query(
            `
            UPDATE assentos
            SET ocupado = FALSE
            WHERE viagem_id = $1
            AND numero = $2
            `,
            [
                dadosCompra.viagem_id,
                dadosCompra.assento_numero
            ]
        );

        // Devolve vaga

        await db.query(
            `
            UPDATE viagens
            SET vagas_disponiveis = vagas_disponiveis + 1
            WHERE id = $1
            `,
            [dadosCompra.viagem_id]
        );

        // Exclui compra

        await db.query(
            `
            DELETE FROM compras
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensagem: 'Compra cancelada com sucesso'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: err.message
        });

    }

});

module.exports = router;