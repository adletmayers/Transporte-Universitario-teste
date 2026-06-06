const express = require('express');
const router = express.Router();

const db = require('../config/database');

/*
========================================
CONSULTAR CARTEIRA
========================================
*/



/*
========================================
CONSULTAR SALDO
========================================
*/

router.get('/saldo/:usuarioId', async (req, res) => {

    try {

        const { usuarioId } = req.params;

        const resultado = await db.query(
            `
            SELECT saldo
            FROM carteiras
            WHERE usuario_id = $1
            `,
            [usuarioId]
        );

        if (resultado.rows.length === 0) {

            return res.json({
                saldo: 0
            });

        }

        res.json({
            saldo: resultado.rows[0].saldo
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});
router.get('/movimentacoes/:usuarioId', async (req, res) => {

    try {

        const { usuarioId } = req.params;

        const resultado = await db.query(
            `
            SELECT *
            FROM movimentacoes_carteira
            WHERE usuario_id = $1
            ORDER BY created_at DESC
            `,
            [usuarioId]
        );

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

router.get('/:usuarioId', async (req, res) => {

    try {

        const { usuarioId } = req.params;

        const usuario = await db.query(
            `
            SELECT id
            FROM usuarios
            WHERE id = $1
            `,
            [usuarioId]
        );

        if (usuario.rows.length === 0) {

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });

        }

        const carteira = await db.query(
            `
            SELECT *
            FROM carteiras
            WHERE usuario_id = $1
            `,
            [usuarioId]
        );

        if (carteira.rows.length === 0) {

            return res.json({
                saldo: 0,
                movimentacoes: []
            });

        }

        res.json(carteira.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});
/*
========================================
ADICIONAR SALDO
========================================
*/

router.post('/recarga', async (req, res) => {

    try {

        const {
            usuario_id,
            valor
        } = req.body;

        if (!usuario_id || !valor) {

            return res.status(400).json({
                erro: 'Informe usuário e valor'
            });

        }

        await db.query(
            `
            UPDATE carteiras
            SET saldo = saldo + $1
            WHERE usuario_id = $2
            `,
            [
                valor,
                usuario_id
            ]
        );

        // REGISTRA MOVIMENTAÇÃO
        await db.query(
            `
            INSERT INTO movimentacoes_carteira
            (
                usuario_id,
                tipo,
                valor
            )
            VALUES
            (
                $1,
                'RECARGA',
                $2
            )
            `,
            [
                usuario_id,
                valor
            ]
        );

        res.json({
            mensagem: 'Recarga realizada com sucesso'
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
DEBITAR SALDO
========================================
*/

router.post('/debito', async (req, res) => {

    try {

        const {
            usuario_id,
            valor
        } = req.body;

        const carteira = await db.query(
            `
            SELECT saldo
            FROM carteiras
            WHERE usuario_id = $1
            `,
            [usuario_id]
        );

        if (carteira.rows.length === 0) {

            return res.status(404).json({
                erro: 'Carteira não encontrada'
            });

        }

        const saldoAtual =
            Number(carteira.rows[0].saldo);

        if (saldoAtual < valor) {

            return res.status(400).json({
                erro: 'Saldo insuficiente'
            });

        }

        await db.query(
            `
            UPDATE carteiras
            SET saldo = saldo - $1
            WHERE usuario_id = $2
            `,
            [
                valor,
                usuario_id
            ]
        );

        // REGISTRA MOVIMENTAÇÃO
        await db.query(
            `
            INSERT INTO movimentacoes_carteira
            (
                usuario_id,
                tipo,
                valor
            )
            VALUES
            (
                $1,
                'DEBITO',
                $2
            )
            `,
            [
                usuario_id,
                valor
            ]
        );

        res.json({
            mensagem: 'Débito realizado com sucesso'
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
HISTÓRICO DA CARTEIRA
========================================
*/


module.exports = router;