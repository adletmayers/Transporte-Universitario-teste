
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);



const viagemId =
localStorage.getItem(
'viagemSelecionada'
);

if(!viagemId){

    alert(
        'Nenhuma viagem selecionada'
    );

    window.location.href =
    'passagens.html';

}

let assentoSelecionado = null;

carregarViagem();
carregarAssentos();

// Atualiza os assentos a cada 10 segundos
setInterval(() => {
    carregarAssentos();
}, 10000);

async function carregarViagem(){

    try{

        const resposta =
        await fetch(
        'http://localhost:3000/passagens'
        );

        const viagens =
        await resposta.json();

        const viagem =
        viagens.find(
            v => v.id == viagemId
        );

        if(!viagem){

            document.getElementById(
                'viagemInfo'
            ).innerHTML =
            'Viagem não encontrada';

            return;

        }

        document.getElementById(
        'viagemInfo'
        ).innerHTML =

        `
        <p>
        <strong>Origem:</strong>
        ${viagem.origem}
        </p>

        <p>
        <strong>Destino:</strong>
        ${viagem.destino}
        </p>

        <p>
        <strong>Data:</strong>
        ${new Date(
        viagem.data_ida
        ).toLocaleDateString('pt-BR')}
        </p>

        <p>
        <strong>Saída:</strong>
        ${viagem.horario_saida.substring(0,5)}
        </p>

        <p>
        <strong>Vagas:</strong>
        ${viagem.vagas_disponiveis}
        </p>

        <h5 class="text-success">
        R$ ${viagem.valor}
        </h5>
        `;

    }catch(err){

        console.log(err);

    }

}

async function carregarAssentos(){

    try{

        console.log('Viagem ID:', viagemId);

        const resposta =
        await fetch(
        `http://localhost:3000/assentos/viagem/${viagemId}`
        );

        console.log('Status:', resposta.status);

        const assentos =
        await resposta.json();

        console.log('Assentos:', assentos);

        let html = '';

        assentos.forEach(a => {

            html += `
            <button
                id="assento-${a.numero}"
                class="assento ${a.ocupado ? 'ocupado' : 'livre'}"
                ${a.ocupado ? 'disabled' : ''}
                onclick="selecionar(${a.numero})">

                ${a.numero}

            </button>
            `;
        });

        console.log(html);

        document.getElementById(
            'assentos'
        ).innerHTML = html;

    }catch(err){

        console.error(err);

    }

}
function selecionar(numero){

    document
    .querySelectorAll('.assento')
    .forEach(btn => {

        if(
        btn.classList.contains(
        'livre'
        )
        ){

            btn.classList.remove(
            'selecionado'
            );

        }

    });

    document
    .getElementById(
    `assento-${numero}`
    )
    .classList.add(
    'selecionado'
    );

    assentoSelecionado =
    numero;

    document.getElementById(
    'assentoEscolhido'
    ).innerHTML =

    `Assento selecionado: ${numero}`;

}

function continuarPagamento(){

    if(!assentoSelecionado){

        alert(
        'Selecione um assento'
        );

        return;

    }

    localStorage.setItem(
        'assentoSelecionado',
        assentoSelecionado
    );

    window.location.href =
    'pagamento.html';

}


