const usuario =
JSON.parse(
    localStorage.getItem('usuario')
);





async function carregarSaldo(){

    try{

        const resposta =
        await fetch(
            `/carteira/saldo/${usuario.id}`
        );

        const dados =
        await resposta.json();

        document.getElementById('saldo').innerHTML =
        `Saldo: R$ ${Number(dados.saldo).toFixed(2)}`;

    }catch(err){

        console.error(err);

    }

}

async function carregarHistorico(){

    try{

        const resposta =
        await fetch(
            `/carteira/movimentacoes/${usuario.id}`
        );

        const movimentacoes =
        await resposta.json();

        console.log(movimentacoes);

        if(movimentacoes.length === 0){

            document.getElementById(
                'historico'
            ).innerHTML =
            '<p>Nenhuma movimentação encontrada.</p>';

            return;

        }

        let html = '';

        movimentacoes.forEach(m => {

            const cor =
            m.tipo === 'RECARGA'
            ? 'text-success'
            : 'text-danger';

            html += `
            <div class="card p-2 mb-2">

                <strong class="${cor}">
                    ${m.tipo}
                </strong>

                <br>

                R$ ${Number(m.valor).toFixed(2)}

                <br>

                <small>
                    ${new Date(m.created_at)
                        .toLocaleString('pt-BR')}
                </small>

            </div>
            `;

        });

        document.getElementById(
            'historico'
        ).innerHTML = html;

    }catch(err){

        console.error(err);

    }

}

async function recarregar(){

    const valor =
    document.getElementById(
        'valorRecarga'
    ).value;

    if(!valor){

        alert('Informe um valor');

        return;

    }

    try{

        const resposta =
        await fetch(
            '/carteira/recarga',
            {
                method:'POST',
                headers:{
                    'Content-Type':
                    'application/json'
                },
                body: JSON.stringify({

                    usuario_id:
                    usuario.id,

                    valor:
                    Number(valor)

                })
            }
        );

        const dados =
        await resposta.json();

        alert(dados.mensagem);

        document.getElementById(
            'valorRecarga'
        ).value = '';

        carregarSaldo();
        carregarHistorico();

    }catch(err){

        console.error(err);

    }

}

carregarSaldo();
carregarHistorico();
