'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class PostImage extends Model {
        static associate(models) {
            PostImage.belongsTo(models.Post, {foreignKey: 'postId', as: 'post'});
        }
    }

    PostImage.init({
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'PostImage',
        tableName: 'PostImages',
        timestamps: true,
    });

    return PostImage;
};
