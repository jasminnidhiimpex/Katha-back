'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('yajman_members', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      yajman_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      full_name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      aadhaar: {
        type: Sequelize.BIGINT, // Aadhaar should use BIGINT to support 12 digits
        allowNull: true,
      },
      mobile: {
        type: Sequelize.BIGINT, // Use BIGINT for mobile numbers too
        allowNull: true,
      },
      is_main_member: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('yajman_members');
  }
};