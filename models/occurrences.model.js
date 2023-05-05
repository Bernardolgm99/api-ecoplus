module.exports = (sequelize, DataTypes) => {

        const occurrence = sequelize.define('occurrence', 
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
            allowNull: false
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
        status: {
            type: DataTypes.INTEGER,
            isIn: [0, 1, 2],
            defaultValue: 0
        }
    });
    return occurrence
}
