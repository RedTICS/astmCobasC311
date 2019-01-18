const lab = require('./service/laboratorio');

async function runGet() {
    return lab.getCobasC311().then((data) => {
        // console.log(data);
        return data;
    }).catch(err => {
        console.log(err);
    })
};

// async function runGet(id) {
//     return lab.getCobasC311ById(id).then((data) => {
//         // console.log(data);
//         return data;
//     }).catch(err => {
//         console.log(err);
//     })
// };

async function runPatch(prestaId, registro) {
    lab.patchCobasC311(prestaId, registro).then((data) => {
        console.log('runPatch data:', data);
    }).catch(err => {
        console.log(err);
    })
};


async function runAll() {
    let data = await runGet();
    let presta = data[data.length - 3];

    Promise.all(data, presta);
    //console.log(presta.registros[4]);

    registro = presta.registros[presta.registros.length - 1];
    registro.valor.resultado.valor = "A++";
    //path: ejecucion.registros.valor.resultado.valor

    //console.log('registro1:', registro);

    let res = await runPatch(presta._id, registro);
    console.log(res);
}

runAll();
