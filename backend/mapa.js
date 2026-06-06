
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);




const mapa =
L.map('map').setView(
    [-1.4558,-48.4902],
    12
);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:
    '&copy; OpenStreetMap'
}
).addTo(mapa);

const marcador =
L.marker(
[-1.4558,-48.4902]
).addTo(mapa);

async function atualizar(){

    try{

        const resposta =
        await fetch(
            'http://localhost:3000/localizacao/1'
        );

        const dados =
        await resposta.json();

        if(!dados.latitude){

            return;

        }

        marcador.setLatLng([
            dados.latitude,
            dados.longitude
        ]);

        mapa.setView([
            dados.latitude,
            dados.longitude
        ]);

        document.getElementById(
        'status'
        ).innerHTML =
        '🟢 Ônibus em movimento';

        document.getElementById(
        'coordenadas'
        ).innerHTML =
        `${dados.latitude}, ${dados.longitude}`;

    }catch(err){

        console.error(err);

    }

}



atualizar();

setInterval(
    atualizar,
    5000
);
