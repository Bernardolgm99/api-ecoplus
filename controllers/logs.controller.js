const db = require('../models/index.js')
const Logs = db.log
const User = db.user
const { errorInternalServerError } = require('../utilities/messages');

exports.createLog = async (req, res) => {

    try {

        if (req.loggedUser) {

            // console.log(req.method)
            // console.log(req.originalUrl)
            // console.log(req.params)
            
            const user = await User.findOne({where: {id: req.loggedUser.id}})
            let action

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
                    break;
            }

            let log = Logs.create({
                description: `User ${user.username} ${action} `
            })

        }

    } catch (err) {
        return res.status(500).json(errorInternalServerError());
    }

}