module.exports = (sequelize, DataTypes) => {
    const rating = sequelize.define('rating',
    {
        like: {
            type: DataTypes.BOOLEAN,
            allowNull:  false,
            defaultValue: false
        },
        dislike: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    return rating
}