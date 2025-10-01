"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class FriendRequest extends Model {
        static associate(models) {
            FriendRequest.belongsTo(models.User, {
                foreignKey: "senderId",
                as: "sender",
            });

            FriendRequest.belongsTo(models.User, {
                foreignKey: "receiverId",
                as: "receiver",
            });
        }
    }

    FriendRequest.init(
        {
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("pending", "accepted", "rejected"),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize,
            modelName: "FriendRequest",
            tableName: "FriendRequests",
            timestamps: true,
            uniqueKeys: {
                unique_friend_request: {
                    fields: ["senderId", "receiverId"],
                },
            },
        }
    );

    return FriendRequest;
};
