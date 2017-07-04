'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'posts',
      'gabberId',
      {
         type: Sequelize.INTEGER,
         allowNull:false,
         references: {
            model: 'gabbers',
            key: 'id'
         }
      }
   )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'posts',
      'gabberId'
   )
  }
};
