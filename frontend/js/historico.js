
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);


carregarHistorico();

async function carregarHistorico(){

    try{

        const resposta =
        await fetch(
            `/compras/${usuario.id}`
        );

        const compras =
        await resposta.json();

        if(!compras.length){

            document.getElementById(
                'historico'
            ).innerHTML =

            `
            <div class="alert alert-warning">

                Você ainda não comprou
                nenhuma passagem.

            </div>
            `;

            return;

        }

        let html = '';

        compras.forEach(c => {

            html += `

            <div class="card shadow mb-3">

                <div class="card-body">

                    <div class="d-flex
                                justify-content-between">

                        <h5>

                            🚌 ${c.origem}
                            ➜
                            ${c.destino}

                        </h5>

                        <span
                        class="badge bg-success">

                        Confirmada

                        </span>

                    </div>

                    <hr>

                    <p>

                        <strong>📅 Data da Viagem:</strong>

                        ${new Date(
                        c.data_ida
                        ).toLocaleDateString('pt-BR')}

                    </p>

                    <p>

                        <strong>🕒 Saída:</strong>

                        ${c.horario_saida.substring(0,5)}

                    </p>

                    <p>

                        <strong>🕒 Chegada:</strong>

                        ${c.horario_chegada.substring(0,5)}

                    </p>

                    <p>

                        <strong>💺 Assento:</strong>

                        ${c.assento_numero}

                    </p>

                    <p>

                        <strong>💳 Forma de Pagamento:</strong>

                        ${c.forma_pagamento}

                    </p>

                    <p>

                        <strong>📆 Compra:</strong>

                        ${
                        c.created_at
                        ?
                        new Date(
                        c.data_compra
                        ).toLocaleString('pt-BR')
                        :
                        'Não informada'
                        }

                    </p>

                    <h4 class="text-success">

                        R$ ${Number(
                        c.valor
                        ).toFixed(2)}


                    </h4>
                    <button
                    class="btn btn-danger"
                    onclick="cancelarCompra(${c.id})">

                    Cancelar Passagem

                    </button>

                </div>

            </div>

            `;

        });

        document.getElementById(
            'historico'
        ).innerHTML = html;

    }catch(err){

        console.error(err);

        document.getElementById(
            'historico'
        ).innerHTML =

        `
        <div class="alert alert-danger">

            Erro ao carregar histórico.

        </div>
        `;

    }

}
async function cancelarCompra(id){

    try{

        if(
            !confirm(
                'Deseja cancelar esta passagem?'
            )
        ){
            return;
        }

        const resposta =
        await fetch(

            `/compras/${id}`,

            {
                method:'DELETE'
            }

        );

        const dados =
        await resposta.json();

        alert(
            dados.mensagem || dados.erro
        );

        carregarHistorico();

    }catch(err){

        console.error(err);

        alert(
            'Erro ao cancelar passagem'
        );

    }

}
