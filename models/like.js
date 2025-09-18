'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Like.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
    }
  }

  Like.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Like",
        tableName: "Likes",
        timestamps: true,
      }
  );

  return Like;
};
