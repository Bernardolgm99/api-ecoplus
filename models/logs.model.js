module.exports = (sequelize, DataTypes) => {
    const logs = sequelize.define('logs', 
    {
        description: {
            type: DataTypes.STRING
        }
    });
    return logs
}