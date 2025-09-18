'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, {foreignKey: 'authorId', as: 'author'});
            Post.hasMany(models.PostImage, {foreignKey: 'postId', as: 'images'});
            Post.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' });
        }
    }

    Post.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'Posts',
        defaultScope: {
            order: [['createdAt', 'DESC']],
        },
        timestamps: true,
    });

    return Post;
};
