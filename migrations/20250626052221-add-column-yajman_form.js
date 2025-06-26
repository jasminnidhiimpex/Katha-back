module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('yajman_form', 'address', {
      type: Sequelize.TEXT, // Change to DATE type
      allowNull: true,
    });
    await queryInterface.addColumn('yajman_form', 'ref_city', {
      type: Sequelize.TEXT, // Change to DATE type
      allowNull: true,
    });
    await queryInterface.addColumn('yajman_form', 'ref_mobile', {
      type: Sequelize.INTEGER, // Change to DATE type
      allowNull: true,
    });
    await queryInterface.addColumn('yajman_form', 'slip_no', {
      type: Sequelize.INTEGER, // Change to DATE type
      allowNull: true,
    });
  },
};