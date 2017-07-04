'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    status: DataTypes.BOOLEAN
  }, {});
  like.associate = function(models) {
     like.belongsTo(models.post, {as: 'post', foreignKey: 'postId'})
  }
  return like;
};
