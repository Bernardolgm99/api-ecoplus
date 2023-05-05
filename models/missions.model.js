module.exports = (sequelize, DataTypes) => {
    const mission = sequelize.define('mission', 
    {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: `Please provide a name!`},
            },
            allowNull:  false
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: `Please provide a description!`},
            },
            allowNull:  false
        },
        end: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {msg: `Please provide a date and an hour!`},
            },
            allowNull:  false,
            isDate: true
        },
        start: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {msg: `Please provide a date and an hour!`},
            },
            allowNull:  false,
            isDate: true
        },
    });
    return mission
}