const url = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=";

const token = "9caf53ea26bf92deb32cba8469fe49427566810b077c7caa538e7ebab59bf181";

async function consultarTipoCambio (){
    try {
        const response = await fetch(url + token);
        if (!response.ok) {
            console.log("Sin respuesta");
            return
        }
        const data = await response.json();
        console.log("Respuesta API: ", data);

        if(!data.bmx || !data.bmx.series || data.bmx.series.length === 0){
            console.log("Estructura de datos inesperadas: ",data);
            return;
        }

        const series = data.bmx.series[0];

        if(!series || series.data || series.datos.length === 0 ){
            console.log("Datos no encontrados en la serie: ", series);
            return;
        }

        const titulo = series.titulo ? series.titulo.trim() : "Sin titulo";
        const fecha = series.datos[0].fecha || "Fecha no disponible";
        const valor = parseFloat(series.datos[0].dato) || 0;

        addRowTable(titulo, fecha, valor)

    } catch (error) {
        console.log("Error de informacion: ", error);
    }
}

const addRowTable = (titulo, fecha, valor) => {
    const tableBody = document.querySelector("#data-table tbody")
    const newRow = document.createElement("tr")

    newRow.innerHTML = `<td>${titulo}</td><td>${fecha}</td><td>${valor}</td>`;
    tableBody.appendChild(newRow)

    document.getElementById("valor").value = valor
}

consultarTipoCambio();

const convertir = () => {
    let valor = parseFloat(document.getElementById("valor").value);
    let cantidad = parseFloat(document.getElementById("cantidad").value);
    let tipoCambio = document.getElementById("tipoCambio").value;

    if (isNaN(valor) || valor === 0 || isNaN(cantidad)) {
        document.getElementById("resultado").value = "Error";
        return;
    }

    let total;
    if (tipoCambio === "MXNtoUSD") {
        total = (cantidad / valor).toFixed(2); // Pesos a dólares
    } else {
        total = (cantidad * valor).toFixed(2); // Dólares a pesos
    }

    document.getElementById("resultado").value = total;
}