const tema =
JSON.parse(
localStorage.getItem('usuario')
)?.tema;

if(tema === 'light'){

    document.body.classList.add(
        'light-mode'
    );

}else{

    document.body.classList.add(
        'dark-mode'
    );

}