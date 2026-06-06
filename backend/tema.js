function aplicarTema(tema){

    document.body.classList.remove(
        'light-mode',
        'dark-mode'
    );

    document.body.classList.add(
        tema === 'light'
        ? 'light-mode'
        : 'dark-mode'
    );

}

const tema =
JSON.parse(
    localStorage.getItem('usuario')
)?.tema || 'dark';

aplicarTema(tema);
window.aplicarTema = aplicarTema;