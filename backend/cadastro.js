
async function cadastrar(){

    const nome =
    document.getElementById('nome').value;

    const email =
    document.getElementById('email').value;

    const senha =
    document.getElementById('senha').value;

    const matricula =
    document.getElementById('matricula').value;

    const universidade =
    document.getElementById('universidade').value;

    const curso =
    document.getElementById('curso').value;

    const turno =
    document.getElementById('turno').value;

    const resposta =
    await fetch(
    'http://localhost:3000/usuarios',
    {
        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({

            nome,
            email,
            senha,
            matricula,
            universidade,
            curso,
            turno

        })

    });

    const dados =
    await resposta.json();

    if(dados.erro){

        alert(dados.erro);

        return;

    }

    alert('Cadastro realizado com sucesso!');

    window.location.href =
    'index.html';

}
