module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('yajman_members', 'full_name', {
      type: Sequelize.STRING(255), // converts to VARCHAR(255)
      allowNull: true,
    });
    await queryInterface.changeColumn('yajman_members', 'gender', {
      type: Sequelize.STRING(255), // converts to VARCHAR(255)
      allowNull: true,
    });
    await queryInterface.addConstraint('yajman_members', {
      fields: ['full_name', 'age', 'aadhaar', 'mobile', 'gender'],
      type: 'unique',
      name: 'unique_member_per_yajman'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('yajman_members', 'unique_member_per_yajman');
  }
};