module.exports = (sequelize, DataTypes) => {
    const badge = sequelize.define('badge', 
    {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: `Please provide a name!`},
            },
            allowNull:  false
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: `Please provide a description!`},
            },
            allowNull:  false
        },
        conditionType: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: `Please provide a condition!`},
            },
            allowNull:  false
        },
        value: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {msg: `Please provide a value!`},
            },
            allowNull:  false
        }
    });
    return badge
}