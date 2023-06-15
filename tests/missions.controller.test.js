require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const server = require('../index').server;
const db = require("../models/index.js");
const Mission = db.mission
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Missions Model', () => {

    describe('Create a New Mission', () => {

        test('Create a New Mission, status -> 401', async () => {

            const res = await request(app).post('/missions').send({});

            expect(res.status).toBe(401)

        })

        test('Create a New Mission, status -> 403', async () => {

            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({});

            expect(res.status).toBe(403)

        })

        test('Create a New Mission, status -> 400 (name)', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({
                "description": "Upload 25605 Events within a month",
                "typeOf": "EVENT",
                "end": 7,
                "objective": 50,
                "image": null
            });

            expect(res.status).toBe(400)

        })

        test('Create a New Mission, status -> 400 (description)', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({
                "name": "25605 Events",
                "typeOf": "EVENT",
                "end": 7,
                "objective": 50,
                "image": null
            });

            expect(res.status).toBe(400)

        })

        test('Create a New Mission, status -> 400 (typeOf)', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({
                "name": "25605 Events",
                "description": "Upload 25605 Events within a month",
                "end": 7,
                "objective": 50,
                "image": null
            });

            expect(res.status).toBe(400)

        })

        test('Create a New Mission, status -> 400 (end)', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({
                "name": "25605 Events",
                "description": "Upload 25605 Events within a month",
                "typeOf": "EVENT",
                "objective": 50,
                "image": null
            });

            expect(res.status).toBe(400)

        })

        test('Create a New Mission, status -> 400 (objective)', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({
                "name": "25605 Events",
                "description": "Upload 25605 Events within a month",
                "typeOf": "EVENT",
                "end": 7,
                "image": null
            });

            expect(res.status).toBe(400)

        })

        test('Create a New Mission, status -> 201', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });


            const res = await request(app).post('/missions').set('Authorization', token).send({
                "name": "25605 Events",
                "description": "Upload 25605 Events within a month",
                "typeOf": "EVENT",
                "end": 7,
                "objective": 50,
                "image": null
            });

            expect(res.status).toBe(201)

        })
        

    })

    describe('Delete Mission', () => {

        test('Delete Mission, status -> 401', async () => {
            
            const mission = await Mission.findOne({where: {name: '25605 Events'}})

            const res = await request(app).delete(`/missions/${mission.id}`).send({});

            expect(res.status).toBe(401)
        })

        test('Delete Mission, status -> 403', async () => {
            
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const mission = await Mission.findOne({where: {name: '25605 Events'}})

            const res = await request(app).delete(`/missions/${mission.id}`).set('Authorization', token).send({});

            expect(res.status).toBe(403)
        })

        test('Delete Mission, status -> 200', async () => {
            
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const mission = await Mission.findOne({where: {name: '25605 Events'}})

            const res = await request(app).delete(`/missions/${mission.id}`).set('Authorization', token).send({});

            expect(res.status).toBe(200)
        })

    })

    describe('Find All Missions', () => {

        test('Find All Missions, status -> 200', async () => {

            const res = await request(app).get(`/missions`).send({});

            expect(res.status).toBe(200)

        })

    })

    describe('Find One Mission', () => {

        test('Find One Mission, status -> 200', async () => {

            const mission = await Mission.findByPk(3)

            const res = await request(app).get(`/missions/${mission.id}`).send({});

            expect(res.status).toBe(200)

        })

    })

}) 