
// USUÁRIO LOGADO

const usuario =
JSON.parse(
localStorage.getItem('usuario')
);
/*
==================================
APLICAR TEMA
==================================
*/


// PROTEÇÃO

if(!usuario){

    alert(
        'Faça login primeiro'
    );

    window.location.href =
    'index.html';

}
if(!usuario?.id){

    alert('Faça login novamente');

    localStorage.removeItem('usuario');

    window.location.href = 'index.html';

}
// MENU ADMIN


/*
==================================
TIPO DE USUÁRIO
==================================
*/

const badge =
document.getElementById(
'badgeTipo'
);

if(usuario.tipo === 'ADMIN'){

    badge.className =
    'badge bg-danger fs-6';

    badge.innerHTML =
    'Administrador';

}else{

    badge.className =
    'badge bg-primary fs-6';

    badge.innerHTML =
    'Aluno';

}

/*
==================================
CARREGAR TEMA
==================================
*/

document.getElementById(
'temaSelect'
).value =
usuario.tema || 'dark';
// DADOS DO PERFIL

document.getElementById('perfil').innerHTML = `

<div class="row">

<div class="col-md-6">

<p>
<strong>🆔 ID:</strong>
${usuario.id}
</p>

<p>
<strong>👤 Nome:</strong>
${usuario.nome}
</p>

<p>
<strong>📧 Email:</strong>
${usuario.email}
</p>

<p>
<strong>🪪 CPF:</strong>
${usuario.cpf || 'Não informado'}
</p>

<p>
<strong>🎂 Data de Nascimento:</strong>
${usuario.data_nascimento || 'Não informada'}
</p>

</div>

<div class="col-md-6">

<p>
<strong>🎓 Matrícula:</strong>
${usuario.matricula || 'Não informada'}
</p>

<p>
<strong>🏫 Universidade:</strong>
${usuario.universidade || 'Não informada'}
</p>

<p>
<strong>📚 Curso:</strong>
${usuario.curso || 'Não informado'}
</p>

<p>
<strong>🕒 Turno:</strong>
${usuario.turno || 'Não informado'}
</p>

<p>
<strong>📅 Validade:</strong>
${usuario.validade_carteirinha || 'Não informada'}
</p>

</div>

</div>

<hr>

<div class="text-center">

<h3 class="text-success">
💳 Saldo Disponível
</h3>

<h2 class="text-success">
R$ ${usuario.saldo || '0,00'}
</h2>

</div>
`;
function editarPerfil(){

    document.getElementById(
        'editNome'
    ).value = usuario.nome || '';

    document.getElementById(
        'editEmail'
    ).value = usuario.email || '';

    document.getElementById(
        'editCpf'
    ).value = usuario.cpf || '';

    document.getElementById(
        'editNascimento'
    ).value =
    usuario.data_nascimento || '';
    document.getElementById(
'editMatricula'
).value =
usuario.matricula || '';

document.getElementById(
'editUniversidade'
).value =
usuario.universidade || '';

document.getElementById(
'editCurso'
).value =
usuario.curso || '';

document.getElementById(
'editTurno'
).value =
usuario.turno || '';

document.getElementById(
'editValidade'
).value =
usuario.validade_carteirinha || '';

    new bootstrap.Modal(

        document.getElementById(
            'modalPerfil'
        )

    ).show();

}
async function salvarPerfil(){

    const resposta =
    await fetch(

        `http://localhost:3000/usuarios/${usuario.id}`,

        {

            method:'PUT',

            headers:{
                'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

                nome:
                document.getElementById(
                'editNome'
                ).value,

                email:
                document.getElementById(
                'editEmail'
                ).value,

                cpf:
                document.getElementById(
                'editCpf'
                ).value,

                data_nascimento:
                document.getElementById(
                'editNascimento'
                ).value,
                matricula:
document.getElementById(
'editMatricula'
).value,

universidade:
document.getElementById(
'editUniversidade'
).value,

curso:
document.getElementById(
'editCurso'
).value,

turno:
document.getElementById(
'editTurno'
).value,

validade_carteirinha:
document.getElementById(
'editValidade'
).value,


                

            })

        }

    );

    const dados =
    await resposta.json();

    alert(
        dados.mensagem
    );

    usuario.nome =
    document.getElementById(
    'editNome'
    ).value;

    usuario.email =
    document.getElementById(
    'editEmail'
    ).value;

    usuario.cpf =
    document.getElementById(
    'editCpf'
    ).value;

    usuario.data_nascimento =
    document.getElementById(
    'editNascimento'
    ).value;
    usuario.matricula =
document.getElementById(
'editMatricula'
).value;

usuario.universidade =
document.getElementById(
'editUniversidade'
).value;

usuario.curso =
document.getElementById(
'editCurso'
).value;

usuario.turno =
document.getElementById(
'editTurno'
).value;

usuario.validade_carteirinha =
document.getElementById(
'editValidade'
).value;

    localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
    );

    location.reload();

}
function alterarSenha(){

    new bootstrap.Modal(

        document.getElementById(
            'modalSenha'
        )

    ).show();

}
async function salvarSenha(){

    const senhaAtual =
    document.getElementById(
    'senhaAtual'
    ).value;

    const novaSenha =
    document.getElementById(
    'novaSenha'
    ).value;

    const confirmarSenha =
    document.getElementById(
    'confirmarSenha'
    ).value;

    if(novaSenha !== confirmarSenha){

        alert(
            'As senhas não coincidem'
        );

        return;

    }

    const resposta =
    await fetch(

        'http://localhost:3000/usuarios/alterar-senha',

        {

            method:'PUT',

            headers:{
                'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

                id: usuario.id,

                senhaAtual,

                novaSenha

            })

        }

    );

    const dados =
    await resposta.json();

    alert(
        dados.mensagem || dados.erro
    );

}
async function alterarTema(){

    const novoTema =
    document.getElementById(
    'temaSelect'
    ).value;

    document.documentElement
    .setAttribute(
        'data-theme',
        novoTema
    );

    usuario.tema =
    novoTema;
    aplicarTema(novoTema);

    localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
    );

    localStorage.setItem(
        'tema',
        novoTema
    );

    try{

        await fetch(

            `http://localhost:3000/usuarios/${usuario.id}`,

            {

                method:'PUT',

                headers:{
                    'Content-Type':
                    'application/json'
                },

                body: JSON.stringify({

                    nome:
                    usuario.nome,

                    email:
                    usuario.email,

                    cpf:
                    usuario.cpf,

                    data_nascimento:
                    usuario.data_nascimento,

                    tema:
                    novoTema

                })

            }

        );

    }catch(err){

        console.log(err);

    }

}
