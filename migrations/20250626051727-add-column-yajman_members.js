module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('yajman_members', 'gender', {
      type: Sequelize.TEXT, // Change to DATE type
      allowNull: true,
    });
  },
};