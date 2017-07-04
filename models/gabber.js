'use strict';
module.exports = function(sequelize, DataTypes) {
  var gabber = sequelize.define('gabber', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return gabber;
};
