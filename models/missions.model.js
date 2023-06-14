module.exports = (sequelize, DataTypes) => {
    const mission = sequelize.define('mission',
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: `Please provide a name!` },
                },
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: `Please provide a description!` },
                },
                allowNull: false
            },
            typeOf: {
                type: DataTypes.STRING,
                validate: {
                    isIn: [['EVENT', 'OCCURRENCE', 'OTHER']]
                },
                allowNull: false
            },
            end: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: { msg: `Please provide a number of days!` },
                },
                allowNull: false
            },
            state: {
                type: DataTypes.INTEGER,
                defaultValue: '0'
            },
            objective: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: { msg: `Please provide a objective value (number)!`}
                },
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
            }, 
            isValid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        });
    return mission
}