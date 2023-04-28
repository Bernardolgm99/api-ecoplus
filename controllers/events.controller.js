const events = require('../models/events.model');

const { validationImage } = require('../utilities/validation');

exports.findEvents = (req, res) => {
    if(req.query.page && req.query.section) {

    } else {
        
    }
}

exports.create = (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400).json({"error": "Please provide title"});
        };
        if (!req.body.description) {
            res.status(400).json({"error": "Please provide description"});
        };
        if (!req.body.location) {
            res.status(400).json({"error": "Please provide location"});
        };
        if (!req.body.date) {
            res.status(400).json({"error": "Please provide date"});
        };
        if (req.body.banner && !validationImage(req.body.banner)){
            res.status(415).json({"error": "Banner need must be an image type"});
        };
    
        res.status(200).json({message : `Event ${event.title} has been created!`});
    }
    catch (err) {
        res.status(500).json({error: "Something went wrong. Please try again later"});
    }

};
