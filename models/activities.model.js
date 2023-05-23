module.exports = (sequelize, DataTypes) => {
        const activity = sequelize.define('activity', 
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
                notEmpty: {msg: `Please provide a description!`}
            },
            allowNull:  false
        },
        start: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {msg: `Please provide a date and an hour!`}
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
                notEmpty: {msg: `Please provide a location!`}
            },
            allowNull:  false
        },
        image: {
            type: DataTypes.BLOB
        },
        diagnosis: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {msg: `Please provide a diagnosis!`}
            }
        },
        objectives: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {msg: `Please provide a objectives!`}
            }
        },
        resources: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {msg: `Please provide a resources!`}
            }
        },
        evaluation_ind: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {msg: `Please provide a evaluation_ind!`}
            }
        },
        evaluation_inst: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {msg: `Please provide a evaluation_inst!`}
            }
        },
    });
    return activity
}
