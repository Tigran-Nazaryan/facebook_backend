'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.DATE,
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    coverPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  });

  return User;
};
