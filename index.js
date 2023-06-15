console.clear()
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const multer = require('multer');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json()); //enable parsing JSON body data
app.use (cors({ origin: '*'}))

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({
        message: `home -- ecoplus api`
    });
});

// routing middleware for resource MOVIES
app.use(fileUpload());
app.use('/activities', require('./routes/activities.routes.js'))
app.use('/events', require('./routes/events.routes.js'))
app.use('/occurrences', require('./routes/occurrences.routes.js'))
app.use('/eventsOccurrences', require('./routes/eventsOccurrences.routes.js'))
app.use('/users', require('./routes/users.routes.js'))
app.use('/comments', require('./routes/comments.routes.js'))
app.use('/rating', require('./routes/rating.routes.js'));
app.use('/badges', require('./routes/badges.routes.js'));
app.use('/logs', require('./routes/logs.routes.js'));
app.use('/schools', require('./routes/schools.routes.js'));
app.use('/missions', require('./routes/missions.routes.js'));
app.use('/suggestions', require('./routes/suggestions.routes.js'));

// increasing headers request space
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'The path especified could not be found' });
})

const server = app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));

module.exports = app
module.exports = server