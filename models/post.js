'use strict';
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {});
  post.associate = function(models) {
     post.belongsTo(models.gabber, {as: 'gabber', foreignKey: 'gabberId'})
     post.hasMany(models.like, {as: 'like', foreignKey: 'postId' })
  }
  return post;
};
