module.exports = {
  up: async (queryInterface, Sequelize) => {
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