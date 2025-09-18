'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "coverPhoto", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "coverPhoto");
  },
};
