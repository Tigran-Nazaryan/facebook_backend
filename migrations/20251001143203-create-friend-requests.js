"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("FriendRequests", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    receiverId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: Sequelize.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addConstraint("FriendRequests", {
    fields: ["senderId", "receiverId"],
    type: "unique",
    name: "unique_friend_request"
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("FriendRequests");
}
