const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;
app.use(express.json()); //enable parsing JSON body data

const config = require('./config/db.config.js');
console.log(config)
// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({
        message: `home -- ecoplus api`
    });
});

// routing middleware for resource MOVIES
app.use('/activities', require('./routes/activities.routes.js'))
app.use('/events', require('./routes/events.routes.js'))
app.use('/occurrences', require('./routes/occurrences.routes.js'))
app.use('/users', require('./routes/users.routes.js'))

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'WHAT???' });
})

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));