const express = require('express');
const router = express.Router();

const db = require('../config/database');

/*
========================================
LISTAR TODOS OS AVISOS
========================================
*/

router.get('/', async (req, res) => {

    try {

        const avisos = await db.query(
            `
            SELECT *
            FROM avisos
            ORDER BY id DESC
            `
        );

        res.json(avisos.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
BUSCAR AVISO POR ID
========================================
*/

router.get('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const aviso = await db.query(
            `
            SELECT *
            FROM avisos
            WHERE id = $1
            `,
            [id]
        );

        if (aviso.rows.length === 0) {

            return res.status(404).json({
                erro: 'Aviso não encontrado'
            });

        }

        res.json(aviso.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
LISTAR APENAS AVISOS IMPORTANTES
========================================
*/

router.get('/categoria/importantes', async (req, res) => {

    try {

        const avisos = await db.query(
            `
            SELECT *
            FROM avisos
            WHERE importante = TRUE
            ORDER BY id DESC
            `
        );

        res.json(avisos.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

/*
========================================
CRIAR AVISO
========================================
*/

router.post('/', async (req, res) => {

    try {

        const {
            titulo,
            mensagem,
            importante
        } = req.body;

        if (!titulo || !mensagem) {

            return res.status(400).json({
                erro: 'Título e mensagem são obrigatórios'
            });

        }

        const novoAviso = await db.query(
            `
            INSERT INTO avisos
            (
                titulo,
                mensagem,
                importante
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING *
            `,
            [
                titulo,
                mensagem,
                importante || false
            ]
        );

        res.status(201).json({
            mensagem: 'Aviso criado com sucesso',
            aviso: novoAviso.rows[0]
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
ATUALIZAR AVISO
========================================
*/

router.put('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            titulo,
            mensagem,
            importante
        } = req.body;

        const existe = await db.query(
            `
            SELECT id
            FROM avisos
            WHERE id = $1
            `,
            [id]
        );

        if (existe.rows.length === 0) {

            return res.status(404).json({
                erro: 'Aviso não encontrado'
            });

        }

        await db.query(
            `
            UPDATE avisos
            SET
                titulo = $1,
                mensagem = $2,
                importante = $3
            WHERE id = $4
            `,
            [
                titulo,
                mensagem,
                importante,
                id
            ]
        );

        res.json({
            mensagem: 'Aviso atualizado com sucesso'
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
EXCLUIR AVISO
========================================
*/

router.delete('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const existe = await db.query(
            `
            SELECT id
            FROM avisos
            WHERE id = $1
            `,
            [id]
        );

        if (existe.rows.length === 0) {

            return res.status(404).json({
                erro: 'Aviso não encontrado'
            });

        }

        await db.query(
            `
            DELETE FROM avisos
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensagem: 'Aviso removido com sucesso'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

module.exports = router;