// LOGIN

const usuario =
JSON.parse(
localStorage.getItem('usuario')
);


if(usuario?.tema === 'light'){

    document.body.classList.add(
        'light-mode'
    );

}else{

    document.body.classList.add(
        'dark-mode'
    );

}
// NAVBAR



carregarCidades();

// CARREGAR ORIGENS E DESTINOS

async function carregarCidades(){

    try{

        const respostaOrigens =
        await fetch(
        '/passagens/origens/lista'
        );

        const origens =
        await respostaOrigens.json();

        console.log("ORIGENS:", origens);

        const respostaDestinos =
        await fetch(
        '/passagens/destinos/lista'
        );

        const destinos =
        await respostaDestinos.json();

        console.log("DESTINOS:", destinos);

        const origemSelect =
        document.getElementById('origem');

        const destinoSelect =
        document.getElementById('destino');

        origens.forEach(o => {

            origemSelect.innerHTML += `
            <option value="${o.origem}">
                ${o.origem}
            </option>
            `;

        });

        destinos.forEach(d => {

            destinoSelect.innerHTML += `
            <option value="${d.destino}">
                ${d.destino}
            </option>
            `;

        });

    }catch(err){

        console.log("ERRO:", err);

    }

}
// BUSCAR

async function buscar(){

    const origem =
    document.getElementById('origem').value;

    const destino =
    document.getElementById('destino').value;

    const data =
    document.getElementById('data').value;

    if(!origem || !destino){

        alert(
            'Selecione origem e destino'
        );

        return;

    }

    try{

        let url =
`/passagens/buscar/filtro?origem=${origem}&destino=${destino}`;

        if(data){

            url += `&data=${data}`;

        }

        const resposta =
        await fetch(url);

        const viagens =
        await resposta.json();

        if(viagens.length === 0){

            document.getElementById(
                'resultado'
            ).innerHTML = `

            <div class="alert alert-warning">

                Nenhuma viagem encontrada.

            </div>

            `;

            return;

        }

        let html = '';

        viagens.forEach(v => {

            html += `

            <div class="card viagem-card mb-4">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">

                        <h4 class="mb-0">

                            🚌 ${v.origem}

                            <span class="mx-2 text-primary">

                                ➜

                            </span>

                            ${v.destino}

                        </h4>

                        <span class="badge bg-success">

                            Disponível

                        </span>

                    </div>

                    <hr>

                    <div class="row">

                        <div class="col-md-3">

                            <strong>📅 Data</strong>

                            <p>

                                ${new Date(v.data_ida)
                                .toLocaleDateString('pt-BR')}

                            </p>

                        </div>

                        <div class="col-md-3">

                            <strong>🕒 Saída</strong>

                            <p>

                                ${v.horario_saida.substring(0,5)}

                            </p>

                        </div>

                        <div class="col-md-3">

                            <strong>🏁 Chegada</strong>

                            <p>

                                ${v.horario_chegada.substring(0,5)}

                            </p>

                        </div>

                        <div class="col-md-3">

                            <strong>💺 Vagas</strong>

                            <p>

                                ${v.vagas_disponiveis}

                            </p>

                        </div>

                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">

                        <h3 class="price-tag">

                            R$ ${parseFloat(v.valor).toFixed(2)}

                        </h3>

                        <button
                            class="btn btn-success"
                            onclick="selecionar(${v.id})">

                            🎟️ Escolher Assento

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

        document.getElementById(
            'resultado'
        ).innerHTML = html;

    }catch(err){

        document.getElementById(
            'resultado'
        ).innerHTML = `

        <div class="alert alert-danger">

            Erro ao buscar viagens.

        </div>

        `;

    }

}

// SELECIONAR VIAGEM

function selecionar(id){

    localStorage.setItem(
        'viagemSelecionada',
        id
    );

    window.location.href =
    'assentos.html';

}



