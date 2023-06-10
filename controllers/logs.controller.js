const db = require('../models/index.js')
const Logs = db.log
const User = db.user
const { errorInternalServerError } = require('../utilities/messages');
const messages = require('../utilities/messages');

exports.createLog = async (req, res) => {

    try {

        // check for a user logged in
        if (req.loggedUser) {

            // check if there's any method being requested
            if(req.method){

                // check if there's any route being requested
                if(req.originalUrl != '/'){

                    const user = await User.findOne({where: {id: req.loggedUser.id}})
                    
                    let action
        
                    // switch to check the method requested
                    switch (req.method) {
                        case 'POST':
        
                            action = 'created'
        
                            break;
                        case 'PUT':
                            
                            action = 'edited'
        
                            break;
                        case 'DELETE':
                            
                            action = 'deleted'
        
                            break;
                        case 'PATCH':
                            
                            action = 'modified'
        
                            break;
                    
                        default:
                            throw Error(
                                res.status(500).json(messages.errorInternalServerError())
                            )
                    }
        
                    // variables for log messages
                    let domain
                    let grammar
                    let idDomain 
        
                    const splittedURL = req.originalUrl.split('/')

                    // switch to check the domain acessed and creating of log messages
                    switch (splittedURL[1]) {
                        case 'users':

                            if(splittedURL[2] == 'login') {

                                action = 'logged'
                                grammar = 'in'
                                domain = ''

                            } else {

                                domain = 'user'
                                grammar = 'an'
                                idDomain = splittedURL[2]

                            }

                            break;
                        case 'occurrences':
        
                            if(splittedURL[3] == 'comments' && splittedURL[5] != 'rating'){
        
                                domain = 'comment in the occurrences section'
                                grammar = 'a'
                                idDomain = splittedURL[4]
        
                            } else if(splittedURL[5] == 'rating') {

                                action = 'rated'
                                grammar = 'an'
                                domain = 'occurrence'
                                idDomain = splittedURL[4]

                            } else {
                                domain = 'occurrence'
                                grammar = 'an'
                                idDomain = splittedURL[2]
                            } 
        
                            break;
                        case 'events':
        
                            if(splittedURL[3] == 'comments' && splittedURL[5] != 'rating'){
                                
                                domain = 'comment in the events section'
                                grammar = 'a'
                                idDomain = splittedURL[4]
        
                            } else if(splittedURL[5] == 'rating') {

                                action = 'rated'
                                grammar = 'an'
                                domain = 'event'
                                idDomain = splittedURL[4]

                            } else {
                                
                                domain = 'event'
                                grammar = 'an'
                                idDomain = splittedURL[2]
                            
                            }
                            
                            break;
                        case 'activities':
        
                            if(splittedURL[3] == 'comments' && splittedURL[5] != 'rating'){
        
                                domain = 'comment in the activities section'
                                grammar = 'a'
        
                            } else if(splittedURL[5] == 'rating') {

                                action = 'rated'
                                grammar = 'an'
                                domain = 'activity'

                            } else {

                                domain = 'activity'
                                grammar = 'an'
                                idDomain = splittedURL[2]
                            
                            }   
                            
                            break;
        
                        case 'badges':
        
                            domain = 'badge'
                            grammar = 'a'
                            idDomain = splittedURL[2]
                        
                            break;
                        case 'missions':
        
                            domain = 'mission'
                            grammar = 'a'
                            idDomain = splittedURL[2]
        
                            break;
        
                        default:
                            throw Error(
                                res.status(500).json(messages.errorInternalServerError())
                            )
                    }

                    let log = Logs.create({
                        description: `User ${user.username} ${action} ${grammar} ${domain} (id: ${idDomain})`
                    }) 

                } else {
                    return messages.errorBadRequest('Bad request') 
                }

            } else {
                return messages.errorBadRequest('Bad request') 
            }

        } else {
            return messages.errorBadRequest('Bad request')
        }

    } catch (err) {
        return res.status(500).json(errorInternalServerError());
    }

}

exports.findAll = async (req, res) => {
    try {

        const logs = await Logs.findAll()
        
        if(logs){

            res.status(200).json(logs)

        } else messages.errorNotFound('Logs')
    
    } catch (err) {
        return res.status(500).json(errorInternalServerError()); 
    }
}