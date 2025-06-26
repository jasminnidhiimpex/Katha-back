module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('yajman_form', 'main_member', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
  },
};