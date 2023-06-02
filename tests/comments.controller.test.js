require('dotenv').config();
const db = require('../models/index');
const Comment = db.comment

describe('Comment Model', () => {

      test('create a new comment - Event', async () => {
        const newComment = await Comment.create({
            'description': 'Yau',
            'userId': 10,
            'eventId': 1
        })

        expect(newComment.description).toBe('Yau')
      })

      // test('Yau destroyer', async () => {
      //   const res = await Comment.destroy({where: {description: 'Yau'}})
      //   const a = 2
        
      //   expect(a).toBe(2)
      // })
})
   