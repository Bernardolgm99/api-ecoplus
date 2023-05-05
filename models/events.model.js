module.exports = (sequelize, DataTypes) => {
            const event = sequelize.define('event', 
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: `Please provide a name!`}
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
            start: {
                type: DataTypes.DATE,
                validate: {
                    notEmpty: {msg: `Please provide a date and an hour!`},
                },
                allowNull:  false,
                isDate: true
            },
            end: {
                type: DataTypes.DATE,
                validate: {
                    notEmpty: {msg: `Please provide a date and an hour!`}
                },
                allowNull:  false,
                isDate: true
            },
            location: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: `Please provide a location!`},
                },
                allowNull:  false
            },
            image: {
                type: DataTypes.BLOB
            },
        });
        return event
}
