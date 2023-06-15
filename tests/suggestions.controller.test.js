require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const server = require('../index').server;
const db = require("../models/index.js");
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Suggestions Model', () => {

    describe('Create a new suggestion', () => {

        test('Create a new suggestion, status -> 401', async () => {

            const res = await request(app).post('/suggestions').send({
                "description": "Mano, eu tou fire"
                });

                expect(res.status).toEqual(401)

        })

        test('Create a new suggestion, status -> 400', async () => {
           
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/suggestions').set('Authorization', token).send({});

            expect(res.status).toEqual(400)
        })

        test('Create a new suggestion, status -> 400 (description)', async () => {
           
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/suggestions').set('Authorization', token).send({
                "type": "Events"
            });

            expect(res.status).toEqual(400)
        })

        test('Create a new suggestion, status -> 400 (type)', async () => {
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/suggestions').set('Authorization', token).send({
                "description": "Mano, eu tou fire"
            });

            expect(res.status).toEqual(400)
        })

        test('Create a new suggestion, status -> 201', async () => {
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/suggestions').set('Authorization', token).send({
                "type": "Events",
                "description": "Mano, eu tou fire"
            });

            expect(res.status).toEqual(201)
        })

    })

    describe('Get one suggestion', () => {

        test('Get one suggestion, status -> 401', async () => {

            const res = await request(app).get('/suggestions/2').send({});

            expect(res.status).toEqual(401)

        })

        test('Get one suggestion, status -> 403', async () => {

            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await await request(app).get('/suggestions/2').set('Authorization', token).send({});

            expect(res.status).toEqual(403)

        })

        test('Get one suggestion, status -> 404', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await await request(app).get('/suggestions/2165165156').set('Authorization', token).send({});

            expect(res.status).toEqual(404)

        })

        test('Get one suggestion, status -> 200', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await await request(app).get('/suggestions/2').set('Authorization', token).send({});

            expect(res.status).toEqual(200)

        })


    })

    describe('Get all suggestions', () => {
        
        test('Get all suggestions, status -> 401', async () => {

            const res = await request(app).get('/suggestions').send({});

            expect(res.status).toEqual(401)

        })

        test('Get all suggestions, status -> 403', async () => {

            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await await request(app).get('/suggestions').set('Authorization', token).send({});

            expect(res.status).toEqual(403)

        })


        test('Get all suggestions, status -> 200', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await await request(app).get('/suggestions').set('Authorization', token).send({});

            expect(res.status).toEqual(200)

        })
    })

})