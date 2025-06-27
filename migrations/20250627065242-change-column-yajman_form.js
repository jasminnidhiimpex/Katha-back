module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('yajman_form', 'ref_mobile', {
      type: Sequelize.BIGINT, 
      allowNull: true,
    });
  },
};