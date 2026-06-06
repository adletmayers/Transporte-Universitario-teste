
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);




document.getElementById(
'nomeUsuario'
).innerHTML =
`Olá ${usuario.nome} 👋`;



async function carregarAvisos(){

    try{

        const resposta =
        await fetch(
        'http://localhost:3000/avisos'
        );

        const avisos =
        await resposta.json();

        let html = '';

        avisos
        .slice(0,3)
        .forEach(aviso=>{

            html += `
            <div class="mb-2">
                🔹 ${aviso.titulo || aviso.mensagem}
            </div>
            `;

        });

        document.getElementById(
        'avisosRecentes'
        ).innerHTML = html;

    }catch{

        document.getElementById(
        'avisosRecentes'
        ).innerHTML =
        'Erro ao carregar avisos';

    }

}
async function carregarSaldo(){

    try{

        const resposta =
        await fetch(
            `http://localhost:3000/carteira/saldo/${usuario.id}`
        );

        const dados =
        await resposta.json();

        document.getElementById('saldo').innerHTML =
        `Saldo: R$ ${Number(dados.saldo).toFixed(2)}`;

    }catch(err){

        console.error(err);

    }

}


carregarAvisos();
carregarSaldo()