'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
            Message.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
        }
    }

    Message.init(
        {
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Message",
            tableName: "Messages",
            timestamps: false,
        }
    );

    return Message;
};
