module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('yajman_form', 'updated_at', {
      type: Sequelize.DATE, 
      allowNull: true,
    });
    await queryInterface.addColumn('yajman_members', 'created_at', {
      type: Sequelize.DATE, 
      allowNull: true,
    });
    await queryInterface.addColumn('yajman_members', 'updated_at', {
      type: Sequelize.DATE, 
      allowNull: true,
    });
  },
};