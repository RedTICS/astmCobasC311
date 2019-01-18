var config = require('./config.private');
// var record = require("./record");

var winston = require('winston');
// var sql = require("seriate");
const models = require('./models')


// SQL Server config settings
// var dbConfig = {
//     "name": "default",
//     "host": config.dbServer,
//     "user": config.dbUser,
//     "password": config.dbPassword,
//     "database": config.dbDatabase
// };

// sql.setDefault(dbConfig);

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/db-error.log', level: config.logLevel }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

function isString(value) { return typeof value === 'string'; }

function saveResult(result, order) {
    var logTime = new Date();
    var tipoMuestra = "Suero/Plasma";
    switch (parseInt(order.biomaterial)) {
        case 1: tipoMuestra = "Suero/Plasma"; break;
        case 2: tipoMuestra = "Orina"; break;
        case 3: tipoMuestra = "CSF"; break;
        case 4: tipoMuestra = "Suprnt"; break;
        case 5: tipoMuestra = "Otros"; break;
    }

    models.ejecuciones.findOne({
        where: {
            numeroProtocolo: order.sampleId,
            test: result.test
        }
    }).then(ejecucion => {
        ejecucion.valor = result.value;
        ejecucion.estado = 2;
        ejecucion.save().then(res => {
            console.log('actualizado:', res);
        }).catch(error => {
            console.log(error);
        });
    }).catch(error => {
        console.log('Error en saveResult: ', error);
    });
}

function hasProtocolsToSend() {
    return models.ejecuciones.count({ where: { 'estado': '0' } }).then(cantidad => {
        return cantidad > 0;
    })
}

function getNextProtocolToSend() {
    return models.ejecuciones.findOne({ where: { 'estado': '0' } }).then(ejecucion => {
        return ejecucion ? ejecucion : null;
    }).catch(error => {
        console.log(error);
    });
    // return sql.execute({
    //     query: "SELECT TOP 1 * FROM LAB_TempProtocoloEnvio WHERE equipo = @equipo",
    //     params: {
    //         equipo: {
    //             type: sql.NVARCHAR,
    //             val: config.analyzer,
    //         }
    //     }
    // })
}

function removeLastProtocolSent() {
    getNextProtocolToSend().then(function (results) {
        for (var i = 0; i < results.length; i++) { // Always only 1 iteration
            var protocol = results[i];
            removeProtocol(protocol);

        }
    }, function (err) {
        logger.error("Something bad happened:", err);
    });
}

function removeProtocol(ejecucion) {
    ejecucion.estado = '1';
    ejecucion.save().then(res => {
        console.log('removeProtocol :', res);
    }).catch(error => {
        console.log(error);
    });
    // return sql.execute({
    //     query: "DELETE FROM LAB_TempProtocoloEnvio WHERE idTempProtocoloEnvio = @_id",
    //     params: {
    //         _id: {
    //             type: sql.INT,
    //             val: idTempProtocolo,
    //         }
    //     }
    // })
}


function logMessages(logMessage, logTime) {
    // sql.execute({
    //     query: "INSERT INTO Temp_Mensaje(mensaje,fechaRegistro) VALUES (@_mensaje,@_fechaRegistro)",
    //     params: {
    //         _mensaje: { type: sql.NVARCHAR, val: logMessage },
    //         _fechaRegistro: { type: sql.DATETIME, val: logTime },
    //     }
    // }).then(function (results) {
    //     logger.info(results);
    // }, function (err) {
    //     logger.error("Something bad happened:", err);
    // });
}


module.exports = {
    saveResult: saveResult,
    hasProtocolsToSend: hasProtocolsToSend,
    getNextProtocolToSend: getNextProtocolToSend,
    removeProtocol: removeProtocol,
    removeLastProtocolSent: removeLastProtocolSent
};