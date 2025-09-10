'use strict';

const { Model } = require('sequelize');

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
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
  });

  return User;
};
