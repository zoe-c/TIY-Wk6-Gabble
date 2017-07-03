'use strict';
module.exports = function(sequelize, DataTypes) {
  var Likes = sequelize.define('Likes', {
    status: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Likes;
};