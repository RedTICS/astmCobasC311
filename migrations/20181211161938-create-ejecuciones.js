'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ejecuciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      _id: {
        type: Sequelize.STRING
      },
      numeroProtocolo: {
        type: Sequelize.STRING
      },
      ejecucion: {
        type: Sequelize.JSON
      },
      test: {
        type: Sequelize.STRING
      },
      conceptId: {
        type: Sequelize.STRING
      },
      valor: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING,
        defaultValue:'0'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ejecuciones');
  }
};