'use strict';

module.exports = {
   up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
       'likes',
       'gabberId',
       {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: {
           model: 'gabbers',
           key: 'id'
         }
       }
     )
   },

   down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn(
      'likes',
      'gabberId'
    )
   }
 };
