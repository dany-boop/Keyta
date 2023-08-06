'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Restaurants', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      business_hours: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      menu: {
        type: Sequelize.TEXT, // Use Sequelize.TEXT for JSON or serialized data
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Restaurants');
  }
};
