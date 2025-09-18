'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("PostImages", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Posts",
                    key: "id",
                },
                onDelete: 'CASCADE',
            },
            imageUrl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("NOW()"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("NOW()"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("PostImages");
    },
};
