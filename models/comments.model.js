module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', 
    {
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: `Please provide a description!`},
            },
            allowNull:  false
        },
        edited: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        like: {
            type: DataTypes.INTEGER,
            default: 0
        },
        dislike: {
            type: DataTypes.INTEGER,
            default: 0
        }
    });
    return comment
}