const express = require('express');
const router = express.Router();
const db = require('../config/database');

/*
========================================
ATUALIZAR LOCALIZAÇÃO
========================================
*/

router.post('/', async (req, res) => {

    try {

        const {
            viagem_id,
            latitude,
            longitude
        } = req.body;

        await db.query(
            `
            INSERT INTO localizacoes
            (
                viagem_id,
                latitude,
                longitude
            )
            VALUES
            (
                $1,$2,$3
            )
            `,
            [
                viagem_id,
                latitude,
                longitude
            ]
        );

        res.json({
            mensagem: 'Localização atualizada'
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            erro:'Erro interno'
        });

    }

});

/*
========================================
OBTER LOCALIZAÇÃO
========================================
*/

router.get('/:viagemId', async (req, res) => {

    try {

        const resultado = await db.query(
            `
            SELECT *
            FROM localizacoes
            WHERE viagem_id = $1
            ORDER BY id DESC
            LIMIT 1
            `,
            [req.params.viagemId]
        );

        res.json(
            resultado.rows[0] || {}
        );

    } catch(err){

        console.error(err);

        res.status(500).json({
            erro:'Erro interno'
        });

    }

});

module.exports = router;