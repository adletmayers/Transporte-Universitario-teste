
const usuario =
JSON.parse(
    localStorage.getItem('usuario')
);

if(!usuario){

    alert('Faça login primeiro');

    window.location.href =
    'index.html';

}
if(!usuario?.id){

    alert('Faça login novamente');

    localStorage.removeItem('usuario');

    window.location.href = 'index.html';

}
async function pagar(){

    const viagemId =
    localStorage.getItem(
        'viagemSelecionada'
    );

    const assento =
    localStorage.getItem(
        'assentoSelecionado'
    );

    const forma =
    document.getElementById(
        'forma'
    ).value;
    if(forma === 'CARTEIRA'){

    const saldoResp =
    await fetch(
        `http://localhost:3000/carteira/saldo/${usuario.id}`
    );

    const saldoDados =
    await saldoResp.json();

    const saldo =
    Number(saldoDados.saldo);

    const respostaViagem =
    await fetch(
        'http://localhost:3000/passagens'
    );

    const viagens =
    await respostaViagem.json();

    const viagem =
    viagens.find(
        v => v.id == viagemId
    );

    if(saldo < Number(viagem.valor)){

        alert(
            'Saldo insuficiente na carteira.'
        );

        return;

    }

}

    if(!viagemId){

        alert(
            'Nenhuma viagem selecionada'
        );

        return;

    }

    if(!assento){

        alert(
            'Nenhum assento selecionado'
        );

        return;

    }

    const botao =
    document.getElementById(
        'btnPagar'
    );

    botao.disabled = true;

    document.getElementById(
        'mensagem'
    ).innerHTML =

    `
    <div class="alert alert-info">
        Processando pagamento...
    </div>
    `;

    try{

        const respostaViagem =
        await fetch(
            'http://localhost:3000/passagens'
        );

        const viagens =
        await respostaViagem.json();

        const viagem =
        viagens.find(
            v => v.id == viagemId
        );

        if(!viagem){

            throw new Error(
                'Viagem não encontrada'
            );

        }

        const resposta =
        await fetch(

            'http://localhost:3000/compras',

            {

                method:'POST',

                headers:{
                    'Content-Type':
                    'application/json'
                },

                body:JSON.stringify({

                    usuario_id:
                    usuario.id,

                    viagem_id:
                    viagemId,

                    assento_numero:
                    assento,

                    valor:
                    viagem.valor,

                    forma_pagamento:
                    forma

                })

            }

        );

        const dados =
        await resposta.json();

        if(dados.erro){

            document.getElementById(
                'mensagem'
            ).innerHTML =

            `
            <div class="alert alert-danger">
                ${dados.erro}
            </div>
            `;

            botao.disabled = false;

            return;

        }

        localStorage.setItem(

            'ultimaCompra',

            JSON.stringify({

                viagem,
                assento,
                forma,
                dataCompra:
                new Date()

            })

        );

        localStorage.removeItem(
            'viagemSelecionada'
        );

        localStorage.removeItem(
            'assentoSelecionado'
        );

        window.location.href =
        'confirmacao.html';

    }catch(err){

        console.error(err);

        document.getElementById(
            'mensagem'
        ).innerHTML =

        `
        <div class="alert alert-danger">
            Erro ao processar pagamento.
        </div>
        `;

        botao.disabled = false;

    }

}
