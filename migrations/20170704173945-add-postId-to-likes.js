'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.addColumn(
      'likes',
      'postId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.removeColumn(
     'likes',
     'postId'
   )
  }
};
