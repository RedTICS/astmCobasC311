var config = require('../config.private.json');
const request = require('request');
// var log = require('@andes/log');

// Invoca a la API de andes y trae las prestaciones enviadas al analizador
function getCobasC311() {
    return new Promise((resolve, reject) => {
        const url = `${config.ANDES_HOST}/modules/rup/laboratorio/practicas/cobasc311`;
        const options = {
            url,
            method: 'GET',
            json: true,
            //body: '',
            headers: {
                Authorization: `JWT ${config.ANDES_KEY}`
            }
        };
        request(options, (error, response, body) => {
            // console.log('response: \n', response);
            if (response.statusCode >= 200 && response.statusCode < 300) {
                return resolve(body);
            }
            let fakeRequest = {
                user: {
                    usuario: 'msNomivac',
                    app: 'integracion-nomivac',
                    organizacion: 'sss'
                },
                ip: 'localhost',
                connection: {
                    localAddress: ''
                }
            };

            // log(fakeRequest, 'microservices:integration:nomivac', undefined, 'postCDA:Nomivac', body);
            return resolve(error || body);
        });
    });
}

// Invoca a la API de andes y trae las prestaciones enviadas al analizador
function getCobasC311ById(id) {
    return new Promise((resolve, reject) => {
        let _id = id; // "5c128fec215f7e26a0ffe9a1";
        //let regId = "5bfd7adb37125318189d478b";
        //let consulta = `{"registroId":"5bfd7adb37125318189d478b"}`;
        const url = `${config.ANDES_HOST}/modules/rup/laboratorio/practicas/cobasc311/${_id}`;
        const options = {
            url,
            method: 'GET',
            json: true,
            // body: JSON.parse(consulta),
            headers: {
                Authorization: `JWT ${config.ANDES_KEY}`
            }
        };
        request(options, (error, response, body) => {
            // console.log('response: \n', response);
            if (response.statusCode >= 200 && response.statusCode < 300) {
                return resolve(body);
            }
            let fakeRequest = {
                user: {
                    usuario: 'msNomivac',
                    app: 'integracion-nomivac',
                    organizacion: 'sss'
                },
                ip: 'localhost',
                connection: {
                    localAddress: ''
                }
            };

            // log(fakeRequest, 'microservices:integration:nomivac', undefined, 'postCDA:Nomivac', body);
            return resolve(error || body);
        });
    });
}

// Invoca a la API de andes y trae las prestaciones enviadas al analizador
function patchCobasC311(prestacionId, registro) {
    return new Promise((resolve, reject) => {
        const url = `${config.ANDES_HOST}/modules/rup/laboratorio/practicas/cobasc311/${prestacionId}`;
        const options = {
            url,
            method: 'PATCH',
            json: true,
            body: registro, // no hace falta JSON.parse(registro) por que ya viene un json
            headers: {
                Authorization: `JWT ${config.ANDES_KEY}`
            }
        };
        request(options, (error, response, body) => {
            if (response.statusCode >= 200 && response.statusCode < 300) {
                return resolve(body);
            }
            let fakeRequest = {
                user: {
                    usuario: 'msNomivac',
                    app: 'integracion-nomivac',
                    organizacion: 'sss'
                },
                ip: 'localhost',
                connection: {
                    localAddress: ''
                }
            };

            // log(fakeRequest, 'microservices:integration:nomivac', undefined, 'postCDA:Nomivac', body);
            return resolve(error || body);
        });
    });
}

module.exports = {
    getCobasC311: getCobasC311,
    getCobasC311ById: getCobasC311ById,
    patchCobasC311: patchCobasC311
}
