module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('yajman_members', 'is_deleted', {
      type: Sequelize.BOOLEAN, 
      allowNull: true,
      defaultValue: false
    });
    await queryInterface.addColumn('yajman_form', 'is_deleted', {
      type: Sequelize.BOOLEAN, 
      allowNull: true,
      defaultValue: false
    });
  },
};