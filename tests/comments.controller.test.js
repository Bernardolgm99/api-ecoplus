require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const db = require("../models/index.js");
const Comment = db.comment
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Comment Model', () => {

      describe('Create Comment', () => {
            
            test('Create Comment, status -> 401', async () => {
                  
                  const token = ''

                  const res = await request(app).post('/occurrences/11/comments').set('Authorization', token).send({
                  "description": "Filme muito top."
                  });

                  expect(res.status).toEqual(401)
            })

            test('Create Comment, status -> 201', async () => {
                  
                  const token = await User.findOne({ where: { id: 11 } })
                  .then(user => {
                        return jwt.sign({ id: user.id, role: user.role },
                              config.SECRET, {
                              expiresIn: '24h' // 24 hours
                        });
                  });

                  const res = await request(app).post('/occurrences/11/comments').set('Authorization', token).send({
                  "description": "Filme Yau."
                  });

                  expect(res.status).toEqual(201)
            })
      })

      describe('Delete Comment', () => {

            test('Delete Comment, status -> 403', async () => {
                  const token = await User.findOne({ where: { id: 17 } })
                  .then(user => {
                        return jwt.sign({ id: user.id, role: user.role },
                              config.SECRET, {
                              expiresIn: '24h' // 24 hours
                        });
                  });

                  const res = await request(app).delete('/occurrences/31/comments/147').set('Authorization', token).send({
                        "description": "Filme muito top."
                        });
      
                        expect(res.status).toEqual(403)
            })

            test('Delete Comment, status -> 200', async () => {

                  const token = await User.findOne({ where: { id: 12 } })
                  .then(user => {
                        return jwt.sign({ id: user.id, role: user.role },
                              config.SECRET, {
                              expiresIn: '24h' // 24 hours
                        });
                  });

                  const comment = await Comment.findOne({ where: {description: "Filme Yau."}})

                  const res = await request(app).delete(`/occurrences/31/comments/${comment.id}`).set('Authorization', token).send({
                        "description": "Filme muito top."
                        });
      
                        expect(res.status).toEqual(200)

            })

      })

      describe('Get One Comment', () => {

            test('Get One Comment, stauts -> 400', async () => {
                  
                  const res = await request(app).get(`/comments/561651654684`).send({})

                  expect(res.status).toEqual(400)
            })

            test('Get One Comment, stauts -> 200', async () => {
                  const res = await request(app).get(`/comments/138`).send({})

                  expect(res.status).toEqual(200) 
            })

      })

      describe('Get All Comments', () => {

            test('Get All Comments, status -> 200', async () => {
                  const res = await request(app).get(`occurrences/11/comments`).send({})

                  expect(res.status).toEqual(200) 
            })

      })

})
   