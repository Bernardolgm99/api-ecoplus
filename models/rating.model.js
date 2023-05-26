module.exports = (sequelize, DataTypes) => {
    const rating = sequelize.define('rating',
    {
        rating: {
            type: DataTypes.BOOLEAN,
            allowNull:  false
        }
    });
    return rating
}