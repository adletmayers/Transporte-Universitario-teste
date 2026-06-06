require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('./config/database');

const app = express();

//app.use(helmet());

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use(morgan('dev'));

// ROTAS

app.use('/rotas', require('./routes/rotas'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/reservas', require('./routes/reservas'));
app.use('/avisos', require('./routes/avisos'));
app.use('/carteira', require('./routes/carteira'));
app.use('/passagens', require('./routes/passagens'));
app.use('/assentos', require('./routes/assentos'));
app.use('/compras', require('./routes/compras'));
app.use('/admin', require('./routes/admin'));
app.use(
    '/localizacao',
    require('./routes/localizacao')
);
app.use(
    '/carteirinha',
    require('./routes/carteirinha')
);

app.get('/', (req, res) => {
    res.json({
        sistema: 'Transporte Universitário',
        status: 'online'
    });
});

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        erro: 'Erro interno do servidor'
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});
