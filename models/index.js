console.clear(); // Clear the console before running

const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config/db.config.js')
const db = {}
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, 
{
    host: config.HOST,
    dialect: 'mysql'
});

db.sequelize = sequelize
db.user = require('./users.model.js')(sequelize, DataTypes)
db.occurrence = require('./occurrences.model.js')(sequelize, DataTypes)
db.activity = require('./activities.model.js')(sequelize, DataTypes)
db.event = require('./events.model.js')(sequelize, DataTypes)
db.comment = require('./comments.model.js')(sequelize, DataTypes)
db.badge = require('./badges.model.js')(sequelize, DataTypes)
db.mission = require('./missions.model.js')(sequelize, DataTypes)
db.log = require('./logs.model.js')(sequelize, DataTypes)
db.school = require('./schools.model.js')(sequelize, DataTypes)
db.rating = require('./rating.model.js')(sequelize, DataTypes)


//1:M
db.event.hasMany(db.comment)
db.comment.belongsTo(db.event);

db.occurrence.hasMany(db.comment)
db.comment.belongsTo(db.occurrence);

db.activity.hasMany(db.comment)
db.comment.belongsTo(db.activity);

db.user.hasMany(db.comment)
db.comment.belongsTo(db.user);

db.comment.hasMany(db.rating)
db.rating.belongsTo(db.comment);

db.user.hasMany(db.occurrence)
db.occurrence.belongsTo(db.user);

db.school.hasMany(db.user)
db.user.belongsTo(db.school);

db.user.hasMany(db.rating)
db.rating.belongsTo(db.user);


//N:M
db.activity.belongsToMany(db.user, {through: 'activityUser'})
db.user.belongsToMany(db.activity, {through: 'activityUser'});

db.event.belongsToMany(db.user, {through: 'eventUser'})
db.user.belongsToMany(db.event, {through: 'eventUser'});

db.user.belongsToMany(db.mission, {through: 'missionUser'})
db.mission.belongsToMany(db.user, {through: 'missionUser'});

db.user.belongsToMany(db.badge, {through: 'badgeUser'})
db.badge.belongsToMany(db.user, {through: 'badgeUser'});

// //alias
db.activity.belongsTo(db.user, {foreignKey: 'IdCreator'});

db.event.belongsTo(db.user, {foreignKey: 'IdCreator'}); 


// (async () => {
//         try {
        
//               await sequelize.sync({alter:true});
//               console.log("DB is successfully synchronized");
//             } catch (error) {
//                   console.log(error);
//                 }
//               })();
            
module.exports = db;