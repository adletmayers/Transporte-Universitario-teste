const usuario =
JSON.parse(
localStorage.getItem('usuario')
);


async function carregar(){

    const resposta =
    await fetch(
    '/admin/relatorios'
    );

    const dados =
    await resposta.json();

    document.getElementById('usuarios').innerHTML =
    dados.usuarios;

    document.getElementById('viagens').innerHTML =
    dados.viagens;

    document.getElementById('compras').innerHTML =
    dados.compras;

    document.getElementById('faturamento').innerHTML =
    `R$ ${dados.faturamento}`;

}

carregar();
