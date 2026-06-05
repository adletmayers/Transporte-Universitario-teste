const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const db = require('../config/database');

/*
========================================
CADASTRO
========================================
*/

router.post('/', async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {

            return res.status(400).json({
                erro: 'Preencha todos os campos'
            });

        }

        if (senha.length < 6) {

            return res.status(400).json({
                erro: 'A senha deve possuir pelo menos 6 caracteres'
            });

        }

        const existe = await db.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existe.rows.length > 0) {

            return res.status(400).json({
                erro: 'Email já cadastrado'
            });

        }

        const hash = await bcrypt.hash(
            senha,
            10
        );

        const novoUsuario = await db.query(
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING id
            `,
            [
                nome,
                email,
                hash
            ]
            );
        await db.query(
            `
            INSERT INTO carteiras
            (
                usuario_id,
                saldo
            )
            VALUES
            (
                $1,
                0
            )
            `,
            [
                novoUsuario.rows[0].id
            ]
            );    

        res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso'
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
LOGIN
========================================
*/

router.post('/login', async (req, res) => {

    try {

        const { email, senha } = req.body;

        if (!email || !senha) {

            return res.status(400).json({
                erro: 'Informe email e senha'
            });

        }

        const usuario = await db.query(
            `
            SELECT *
            FROM usuarios
            WHERE email = $1
            `,
            [email]
        );

        if (usuario.rows.length === 0) {

            return res.status(401).json({
                erro: 'Email ou senha inválidos'
            });

        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.rows[0].senha
        );

        if (!senhaValida) {

            return res.status(401).json({
                erro: 'Email ou senha inválidos'
            });

        }

        res.json({
               id: usuario.rows[0].id,
                nome: usuario.rows[0].nome,
                email: usuario.rows[0].email,
                cpf: usuario.rows[0].cpf,
                data_nascimento: usuario.rows[0].data_nascimento,
                tipo: usuario.rows[0].tipo || 'ALUNO',
                tema: usuario.rows[0].tema || 'dark',
                saldo: usuario.rows[0].saldo || 0
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
ALTERAR SENHA
========================================
*/

router.put('/alterar-senha', async (req, res) => {

    try {

        const {
            id,
            senhaAtual,
            novaSenha
        } = req.body;

        if (
            !id ||
            !senhaAtual ||
            !novaSenha
        ) {

            return res.status(400).json({
                erro: 'Preencha todos os campos'
            });

        }

        const usuario = await db.query(
            `
            SELECT senha
            FROM usuarios
            WHERE id = $1
            `,
            [id]
        );

        if (usuario.rows.length === 0) {

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });

        }

        const senhaValida = await bcrypt.compare(
            senhaAtual,
            usuario.rows[0].senha
        );

        if (!senhaValida) {

            return res.status(400).json({
                erro: 'Senha atual incorreta'
            });

        }

        const hash = await bcrypt.hash(
            novaSenha,
            10
        );

        await db.query(
            `
            UPDATE usuarios
            SET senha = $1
            WHERE id = $2
            `,
            [
                hash,
                id
            ]
        );

        res.json({
            mensagem: 'Senha alterada com sucesso'
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
ATUALIZAR PERFIL
========================================
*/

router.put('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nome,
            email,
            cpf,
            data_nascimento,
            tema
        } = req.body;

        const verificaEmail = await db.query(
            `
            SELECT id
            FROM usuarios
            WHERE email = $1
            AND id <> $2
            `,
            [
                email,
                id
            ]
        );

        if (verificaEmail.rows.length > 0) {

            return res.status(400).json({
                erro: 'Este email já está sendo utilizado'
            });

        }

        await db.query(
    `
    UPDATE usuarios
    SET
        nome = $1,
        email = $2,
        cpf = $3,
        data_nascimento = $4,
        tema = $5
    WHERE id = $6
    `,
    [
        nome,
        email,
        cpf,
        data_nascimento,
        tema || 'dark',
        id
    ]
);

        res.json({
            mensagem: 'Perfil atualizado com sucesso'
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
BUSCAR USUÁRIO
========================================
*/

router.get('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const usuario = await db.query(
            `
            SELECT
                id,
                nome,
                email,
                cpf,
                data_nascimento,
                tipo,
                tema,
                saldo,
                foto_perfil
            FROM usuarios
            WHERE id = $1
            `,
            [id]
        );

        if (usuario.rows.length === 0) {

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });

        }

        res.json(
            usuario.rows[0]
        );

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }

});

module.exports = router;