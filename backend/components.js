async function carregarNavbar() {

    const emAdmin =
        window.location.pathname.includes('/admin/');

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    if (!usuario) {

        alert('Faça login primeiro');

        window.location.href =
            emAdmin ? '../index.html' : 'index.html';

        return;
    }

    const caminhoNavbar =
        emAdmin ? '../navbar.html' : 'navbar.html';

    try {

        const response = await fetch(caminhoNavbar);

        if (!response.ok) {
            throw new Error('Erro ao carregar navbar');
        }

        const html = await response.text();

        document.getElementById(
            'navbar-container'
        ).innerHTML = html;
        const temaAtual = localStorage.getItem('tema') || 'dark';

            if (window.aplicarTema) {
                window.aplicarTema(temaAtual);
            }

        // Ajusta links quando estiver em /admin
        if (emAdmin) {

            document
                .querySelectorAll('#navbar-container a[href]')
                .forEach(link => {

                    const href =
                        link.getAttribute('href');

                    if (
                        href &&
                        !href.startsWith('http') &&
                        !href.startsWith('#') &&
                        !href.startsWith('../')
                    ) {
                        link.setAttribute(
                            'href',
                            '../' + href
                        );
                    }

                });

            // Corrige logo
            const logo =
                document.querySelector('.nav-logo');

            if (logo) {
                logo.src =
                    '../img/Adobe Express - file.png';
            }
        }

        // Nome do usuário
        const usuarioEl =
            document.getElementById('usuario');

        if (usuarioEl) {

            usuarioEl.innerHTML =
                `Olá ${usuario.nome} 👋`;

        }

        // Menu admin
        const menuAdmin =
            document.getElementById('menuAdmin');

        if (
            menuAdmin &&
            usuario.tipo === 'ADMIN'
        ) {

            menuAdmin.style.display = 'block';

        }

    } catch (erro) {

        console.error(
            'Erro ao carregar navbar:',
            erro
        );

    }

}

function sair() {

    localStorage.removeItem(
        'usuario'
    );

    const emAdmin =
        window.location.pathname.includes('/admin/');

    window.location.href =
        emAdmin ? '../index.html' : 'index.html';

}

document.addEventListener(
    'DOMContentLoaded',
    carregarNavbar
);