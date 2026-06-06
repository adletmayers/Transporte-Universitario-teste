
const compra =
JSON.parse(
localStorage.getItem(
'ultimaCompra'
)
);

if(!compra){

    document.getElementById(
    'dados'
    ).innerHTML =

    `
    <div class="alert alert-warning">

        Nenhuma compra encontrada.

    </div>
    `;

}else{

    document.getElementById(
    'dados'
    ).innerHTML =

    `

    <p>

        <strong>Origem:</strong>

        ${compra.viagem.origem}

    </p>

    <p>

        <strong>Destino:</strong>

        ${compra.viagem.destino}

    </p>

    <p>

        <strong>Assento:</strong>

        ${compra.assento}

    </p>

    <p>

        <strong>Pagamento:</strong>

        ${compra.forma}

    </p>

    <p>

        <strong>Data da Compra:</strong>

        ${
            compra.dataCompra
            ?
            new Date(
                compra.dataCompra
            ).toLocaleString('pt-BR')
            :
            '-'
        }

    </p>

    <p>

        <strong>Valor:</strong>

        R$ ${Number(
            compra.viagem.valor
        ).toFixed(2)}

    </p>

    `;

}
