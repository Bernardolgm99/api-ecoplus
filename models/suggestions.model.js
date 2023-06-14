module.exports = (sequelize, DataTypes) => {
    const suggestions = sequelize.define('sugestions',
    {
        type: {
            type: DataTypes.STRING,
            isIn: ['General', 'Occurrences', 'Activities', 'Events', 'Missions', 'Badges', 'Other'],
            defaultValue: 'General'
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: `Please provide a description!` },
            },
            allowNull: false
        }
    });
    return suggestions
}