
        function toggleSenha() {

                document.getElementById('senha');

            campo.type =
                campo.type === 'password'
                    ? 'text'
                    : 'password';

        }

        async function entrar() {

            const email =
                document.getElementById('email').value.trim();

            const senha =
                document.getElementById('senha').value;

            if (!email || !senha) {

                alert('Preencha email e senha');

                return;

            }

            const botao =
                document.getElementById('btnLogin');

            botao.disabled = true;

            botao.innerHTML =
                '<span class="spinner-border spinner-border-sm"></span> Entrando...';

            try {

                const resposta = await fetch(
                    '/usuarios/login',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            senha
                        })
                    }
                );

                const dados =
                    await resposta.json();
                    console.log("DADOS LOGIN:", dados);

                if (dados.erro) {

                    alert(dados.erro);

                    botao.disabled = false;

                    botao.innerHTML =
                        'Entrar';

                    return;

                }

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(dados)
                );

                /*
                tema salvo no banco
                */

                if (dados.tema) {

                    localStorage.setItem(
                        'tema',
                        dados.tema
                    );

                }

                window.location.href =
                    'dashboard.html';

            } catch (err) {

                alert(
                    'Não foi possível conectar ao servidor.'
                );

                botao.disabled = false;

                botao.innerHTML =
                    'Entrar';

            }

        }
