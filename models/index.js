const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config/db.config.js')
const db = {}
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, 
{
    host: config.HOST,
    dialect: 'mysql'
});


const User = sequelize.define("user",
{
    idUser: DataTypes.INTEGER,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    idGenre: DataTypes.INTEGER,
    genreDesc: DataTypes.STRING,
    address: DataTypes.STRING,
    postalCode: DataTypes.INTEGER,
    localion: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    contact: DataTypes.INTEGER,
    idSchool: DataTypes.INTEGER,
    schoolDesc: DataTypes.STRING,
    image: DataTypes.BLOB,
    icone: DataTypes.BLOB,
    idCreator: DataTypes.INTEGER
});

const Occurrence = sequelize.define('occurrence', 
{
    idOccurrence: DataTypes.INTEGER,
    occurrenceName: DataTypes.STRING,
    occurrenceDesc: DataTypes.STRING,
    dateHour: DataTypes.DATE,
    occurrenceLocation: DataTypes.STRING,
    images: DataTypes.BLOB,
    idCreator: DataTypes.INTEGER
});

const Activity = sequelize.define('activity', 
{
    idActivity: DataTypes.INTEGER,
    activityName: DataTypes.STRING,
    activityDesc: DataTypes.STRING,
    dateHour: DataTypes.DATE,
    activitylocation: DataTypes.STRING,
    image: DataTypes.BLOB,
    idCreator: DataTypes.INTEGER
});

const Event = sequelize.define('event', 
{
    idEvent: DataTypes.INTEGER,
    eventName: DataTypes.STRING,
    eventDesc: DataTypes.STRING,
    dateHour: DataTypes.DATE,
    eventLocation: DataTypes.STRING,
    image: DataTypes.BLOB,
    idCreator: DataTypes.INTEGER
});

const Comment = sequelize.define('comment', 
{
    idComment: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    dateHour: DataTypes.DATE,
    commentDesc: DataTypes.STRING,
    idActivity: DataTypes.INTEGER,
    idEvent: DataTypes.INTEGER
});

const Badge = sequelize.define('badge', 
{
    idBadge: DataTypes.INTEGER,
    badgeName: DataTypes.STRING,
    badgeLogo: DataTypes.BLOB,
    badgeDesc: DataTypes.STRING,
    badgeCondition: DataTypes.STRING
});

const Mission = sequelize.define('mission', 
{
    idMission: DataTypes.INTEGER,
    missionName: DataTypes.STRING,
    missionDesc: DataTypes.STRING,
    missionDuration: DataTypes.INTEGER,
    missionStart: DataTypes.DATE,
});

const Logs = sequelize.define('logs', 
{
    idLogs: DataTypes.INTEGER,
    logsDesc: DataTypes.STRING
});

const School = sequelize.define('school', 
{
    idSchool: DataTypes.INTEGER,
    schoolDesc: DataTypes.STRING
});

//1:M
Event.hasMany(Comment)
Comment.belongsTo(Event, { through: 'idEvent'});

Activity.hasMany(Comment)
Comment.belongsTo(Activity, { through: 'idActivity' });

User.hasMany(Comment)
Comment.belongsTo(User, { through: 'idUser' });

User.hasMany(Occurrence)
Occurrence.belongsTo(User, { through: 'idCreator' });

School.hasMany(User)
User.belongsTo(School, { through: 'idSchool' });

// //N:M
Activity.belongsToMany(User, { through: 'userActivity' })
User.belongsToMany(Activity, { through: 'userActivity' });

Event.belongsToMany(User, { through: 'userEvent' })
User.belongsToMany(Event, { through: 'userEvent' });

User.belongsToMany(Mission, { through: 'userMission' })
Mission.belongsToMany(User, { through: 'userMission' });

User.belongsToMany(Badge, { through: 'userBadge' })
Badge.belongsToMany(User, { through: 'userBadge' });

// //alias
// User.hasMany(Activity)
// Activity.belongsTo(User, { as: 'idCreator' });

// User.hasMany(Event)
// Event.belongsTo(User, { as: 'idCreator' }) 


(async () => {
    try {

      await sequelize.sync();
      console.log("DB is successfully synchronized");
    } catch (error) {
      console.log(error);
    }
  })();

db.sequelize = sequelize;
db.User = User
db.Occurrence = Occurrence
db.Activity = Activity
db.Event = Event
db.Comment = Comment
db.Badge = Badge
db.Mission = Mission
db.Logs = Logs
db.School = School
module.exports = db