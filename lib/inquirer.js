'use strict';
var inquirer = require('inquirer');
var SerialPort = require('serialport');

console.log('welcome!');

var portList = [];
SerialPort.list(function (err, ports) {
    ports.forEach(port => {
       return portList.push(port.comName);
    });
});

var questions = [
    {
        type: 'list',
        name: 'modo',
        message: 'En que modo desea ejecutar la app?',
        choices: ['Cliente', 'Servidor'],
        filter: function (val) {
            return val.toLowerCase();
        }
    }
    // {
    //     type: 'checkbox',
    //     name: 'ignore',
    //     message: 'Seleccione el puerto a usar:',
    //     choices: portList
    //     //default: ['node_modules', 'bower_components']
    // }
];

inquirer.prompt(questions).then(answers => {
    console.log('\nConfiguracion solicitada:');
    console.log(JSON.stringify(answers, null, '  '));
});
