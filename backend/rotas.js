
const usuario =
JSON.parse(
localStorage.getItem('usuario')
);



fetch(
'/rotas'
)
.then(r => r.json())
.then(dados => {

let html = '';

document.getElementById(
'totalRotas'
).innerHTML =
dados.length;

dados.forEach(r => {

const porcentagem =
(r.lotacao / r.capacidade) * 100;

html += `

<tr>

<td>
${r.id}
</td>

<td>
${r.nome}
</td>

<td>
${r.horario}
</td>

<td>
${r.capacidade}
</td>

<td>

<div class="progress">

<div
class="progress-bar"
role="progressbar"
style="width:${porcentagem}%">

${r.lotacao}/${r.capacidade}

</div>

</div>

</td>

</tr>

`;

});

document.getElementById(
'tabela'
).innerHTML = html;

});

function filtrarRotas(){

const texto =
document.getElementById('busca')
.value
.toLowerCase();

const linhas =
document.querySelectorAll(
'#tabela tr'
);

linhas.forEach(linha => {

if(

linha.innerText
.toLowerCase()
.includes(texto)

){

linha.style.display = '';

}else{

linha.style.display = 'none';

}

});

}


