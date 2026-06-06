const usuario =
JSON.parse(
Storage.getItem('usuario')
);



async function carregarCarteirinha(){

    try{

        const resposta =
        await fetch(
            `/carteirinha/${usuario.id}`
        );

        const dados =
        await resposta.json();
        console.log(dados);

        if(dados.erro){

            alert(dados.erro);

            return;

        }

        document.getElementById(
            'nome'
        ).innerText =
        dados.nome || '-';

        document.getElementById(
            'matricula'
        ).innerText =
        dados.matricula || '-';

        document.getElementById(
            'curso'
        ).innerText =
        dados.curso || '-';

        document.getElementById(
            'instituicao'
        ).innerText =
        dados.universidade || '-';

        document.getElementById(
            'turno'
        ).innerText =
        dados.turno || '-';

        document.getElementById(
            'validade'
        ).innerText =
        dados.validade_carteirinha
        ?
        new Date(
            dados.validade_carteirinha
        ).toeDateString('pt-BR')
        :
        '-';

        if(dados.foto_perfil){

            document.getElementById(
                'fotoAluno'
            ).src =
            dados.foto_perfil;

        }

        new QRCode(

            document.getElementById(
                'qrcode'
            ),

            {
                text:
                JSON.stringify({

                    id: usuario.id,
                    nome: dados.nome,
                    matricula: dados.matricula

                }),

                width:150,
                height:150
            }

        );

    }catch(err){

        console.error(err);

        alert(
            'Erro ao carregar carteirinha'
        );

    }

}

carregarCarteirinha();
