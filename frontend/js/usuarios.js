
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);


carregarUsuarios();

async function carregarUsuarios(){

    try{

        const resposta =
        await fetch(
            '/admin/usuarios'
        );

        const usuarios =
        await resposta.json();

        let html = '';

        usuarios.forEach(u => {

            html += `

            <div class="card p-3 mb-3 shadow">

                <h5>${u.nome}</h5>

                <p>${u.email}</p>

                <p>
                Tipo:
                <strong>${u.tipo}</strong>
                </p>

                <div class="d-flex gap-2">

                    <button
                    class="btn btn-warning"
                    onclick="promover(${u.id})">

                    Tornar ADMIN

                    </button>

                    <button
                    class="btn btn-danger"
                    onclick="excluir(${u.id})">

                    Excluir

                    </button>

                </div>

            </div>

            `;

        });

        document.getElementById(
        'listaUsuarios'
        ).innerHTML = html;

    }catch(err){

        console.log(err);

    }

}

async function promover(id){

    const resposta =
    await fetch(

        `/admin/usuarios/${id}/admin`,

        {
            method:'PUT'
        }

    );

    const dados =
    await resposta.json();

    alert(
        dados.mensagem
    );

    carregarUsuarios();

}

async function excluir(id){

    const confirmar =
    confirm(
        'Deseja excluir este usuário?'
    );

    if(!confirmar){

        return;

    }

    const resposta =
    await fetch(

        `/admin/usuarios/${id}`,

        {
            method:'DELETE'
        }

    );

    const dados =
    await resposta.json();

    alert(
        dados.mensagem
    );

    carregarUsuarios();

}
