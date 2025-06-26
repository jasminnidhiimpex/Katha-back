'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('yajman_form', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ref_name : {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      city: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      village: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      department: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      member_count : {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_amount : {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      payment_status : {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      payment_date : {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payment_ref : {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at : {
        type: Sequelize.DATE,
        allowNull: true
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('yajman_form');
  },
};