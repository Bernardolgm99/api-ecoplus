module.exports = (sequelize, DataTypes) => {
    const rating = sequelize.define('rating',
    {
        like: {
            type: DataTypes.BOOLEAN,
            allowNull:  false
        }
    });
    return rating
}