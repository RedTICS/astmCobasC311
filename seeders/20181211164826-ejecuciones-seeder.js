'use strict';
const models = require('../models');
const srv = require('../service/laboratorio')

module.exports = {
    up: (queryInterface, Sequelize) => {

        return srv.getCobasC311().then((data) => {
            return queryInterface.bulkInsert('ejecuciones', data, {}, models.ejecuciones.attributes);
        }).catch(err => {
            console.log(err);
        })
    },

    down: (queryInterface, Sequelize) => {
        /*    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete('ejecuciones', null, {});
    }
};
