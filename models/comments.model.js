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
        }
    });
    return comment
}