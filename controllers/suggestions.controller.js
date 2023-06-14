const db = require('../models/index');
const Suggestion = db.suggestions;
const messages = require('../utilities/messages');

exports.create = async (req, res) => {
    try {
        let suggestion = {}
        switch ("validationBodyData") {
            case "validationBodyData": 
            
                if(!req.loggedUser) {res.status(401).json(messages.errorUnathorized()); break;}
    
                if(!req.body.description) { res.status(400).json(messages.errorBadRequest(1, "description")); break;};
    
                if(typeof (req.body.description) != "string") {res.status(400).json(messages.errorBadRequest(0, "Description", "string")); break;};
                if(typeof (req.body.type) != "string") {res.status(400).json(messages.errorBadRequest(0, "Type", "string")); break;};

                suggestion.type = req.body.type;
                suggestion.description = req.body.description;
                suggestion.userId = req.loggedUser.id;

                case "create":
                    let newSuggestion = await Suggestion.create(suggestion);
                    res.status(201).json(messages.successCreated("Suggestion", newSuggestion.id))
        }
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.findAll = async (req, res) => {
    try{
        if(req.loggedUser.role == 'admin') {
            	
            const suggestion = await Suggestion.findAll(req.params.suggestionId)

            if(suggestion) {

                res.status(200).json(suggestion)

            } else res.status(404).json({ error: `${req.params.eventId} not founded` })
            
        } else res.status(403).json(messages.errorForbidden())
    
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.findOne = async (req, res) => {
    try{
        if(req.loggedUser.role == 'admin') {
            	
            const suggestion = await Suggestion.findByPk(req.params.suggestionId)

            if(suggestion) {

                res.status(200).json(suggestion)

            } else res.status(404).json({ error: `${req.params.eventId} not founded` })
            
        } else res.status(403).json(messages.errorForbidden())
    
    } catch (err) {
        console.log(err)
        res.status(500).json(messages.errorInternalServerError());
    }
}