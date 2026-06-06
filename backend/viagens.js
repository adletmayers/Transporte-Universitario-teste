
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);


async function salvar(){

    const viagemId =
    localStorage.getItem(
    'editarViagemId'
    );
    console.log('ID edição:', viagemId);

    const url = viagemId
    ? `/admin/viagens/${viagemId}`
    : '/admin/viagens';

    const metodo = viagemId
    ? 'PUT'
    : 'POST';
    console.log('Método:', metodo);
    console.log('URL:', url);

    const resposta = await fetch(

        url,

        {
            method: metodo,

            headers:{
                'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

                origem:
                document.getElementById('origem').value,

                destino:
                document.getElementById('destino').value,

                data_ida:
                document.getElementById('data').value,

                horario_saida:
                document.getElementById('saida').value,

                horario_chegada:
                document.getElementById('chegada').value,

                valor:
                document.getElementById('valor').value,

                vagas_totais:
                document.getElementById('vagas').value

            })

        }

    );

    const dados =
    await resposta.json();

    if(dados.erro){

        alert(dados.erro);

        return;

    }

    alert(

        viagemId
        ? 'Viagem atualizada!'
        : 'Viagem cadastrada!'

    );

    localStorage.removeItem(
    'editarViagemId'
    );
    document.getElementById(
    'tituloPagina'
    ).innerText =
    'Cadastrar Viagem';

    document.getElementById(
    'btnSalvar'
    ).innerText =
    'Cadastrar';

    document.getElementById(
    'btnSalvar'
    ).classList.remove(
    'btn-warning'
    );

    document.getElementById(
    'btnSalvar'
    ).classList.add(
    'btn-success'
    );

    location.reload();

}



carregarViagens();
async function carregarViagens(){

    try{

        const resposta =
        await fetch(
        '/admin/viagens'
        );

        const viagens =
        await resposta.json();

        let html = '';

        viagens.forEach(v => {

            html += `

            <div class="card p-3 mb-3 shadow">

                <h5>

                🚌 ${v.origem}
                ➜
                ${v.destino}

                </h5>

                <p>

                Data:
                📅 ${new Date(v.data_ida)
                .toLocaleDateString('pt-BR')}
                </p>

                <p>
                🕒 ${v.horario_saida.substring(0,5)}
                ➜
                ${v.horario_chegada.substring(0,5)}
                </p>

                <p>
                💰 R$ ${v.valor}
                </p>

                <p>
                👥 ${v.vagas_disponiveis}/${v.vagas_totais} vagas
                
                </p>

                <div class="d-flex gap-2">

                <button
                class="btn btn-warning"
                onclick="editarViagem(${v.id})">

                Editar

                </button>

                <button
                class="btn btn-danger"
                onclick="excluirViagem(${v.id})">

                Excluir

                </button>

            </div>
                        

            </div>

            `;

        });

        document.getElementById(
        'listaViagens'
        ).innerHTML = html;

    }catch(err){

        console.log(err);

    }

}
async function excluirViagem(id){

    const confirmar =
    confirm(
        'Deseja excluir esta viagem?'
    );

    if(!confirmar){

        return;

    }

    const resposta =
    await fetch(

        `/admin/viagens/${id}`,

        {
            method:'DELETE'
        }

    );

    const dados =
    await resposta.json();

    alert(
        dados.mensagem
    );

    carregarViagens();

}
async function editarViagem(id){

    try{

        const resposta =
        await fetch(
            `/admin/viagens/${id}`
        );

        const viagem =
        await resposta.json();

        console.log(viagem);

        document.getElementById('origem').value =
        viagem.origem;

        document.getElementById('destino').value =
        viagem.destino;

        document.getElementById('data').value =
        viagem.data_ida.split('T')[0];

        document.getElementById('saida').value =
        viagem.horario_saida.substring(0,5);

        document.getElementById('chegada').value =
        viagem.horario_chegada.substring(0,5);

        document.getElementById('valor').value =
        viagem.valor;

        document.getElementById('vagas').value =
        viagem.vagas_totais;

        localStorage.setItem(
            'editarViagemId',
            id
            
        );
        document.getElementById(
        'tituloPagina'
        ).innerText =
        'Editar Viagem';

        document.getElementById(
        'btnSalvar'
        ).innerText =
        'Atualizar';

        document.getElementById(
        'btnSalvar'
        ).classList.remove(
        'btn-success'
        );

        document.getElementById(
        'btnSalvar'
        ).classList.add(
        'btn-warning'
        );

        console.log('Campos preenchidos');

    }catch(err){

        console.error(err);

    }

}
