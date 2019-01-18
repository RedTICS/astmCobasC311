'use strict';
module.exports = (sequelize, DataTypes) => {
  const ejecuciones = sequelize.define('ejecuciones', {
    _id: DataTypes.STRING,
    numeroProtocolo: DataTypes.STRING,
    ejecucion: DataTypes.JSON,
    test: DataTypes.STRING,
    conceptId: DataTypes.STRING,
    valor: DataTypes.STRING,
    estado: DataTypes.STRING
  }, {});
  ejecuciones.associate = function(models) {
    // associations can be defined here
  };
  return ejecuciones;
};