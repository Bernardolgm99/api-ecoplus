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
            allowNull: false,
            defaultValue: false
        },
        like: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dislike: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    return comment
}