"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Friend extends Model {
        static associate(models) {
            Friend.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            Friend.belongsTo(models.User, { foreignKey: "friendId", as: "friend" });
        }
    }

    Friend.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            friendId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Friend",
            tableName: "Friends",
            timestamps: true,
            uniqueKeys: {
                unique_friend: {
                    fields: ["userId", "friendId"],
                },
            },
        }
    );

    return Friend;
};
