require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const db = require("../models/index.js");
const Logs = db.log
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Logs Model', () => {

    describe('Create Log', () => {

        test('Create Occurrence Log, status -> 401', async () => {

            const res = await request(app).post('/occurrences').send({
                "name": "Planta Morreu",
                "description": "Planta morta do lado de fora da porta",
                "location": "Matosinhas", 
                "image": {}
            })

            expect(res.status).toEqual(401)

        })

        test('Create Log, status -> 201', async () => {

            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Planta Morreu",
                "description": "Planta morta do lado de fora da porta",
                "location": "Matosinhas", 
                "image": {}
            })

            expect(res.status).toEqual(201)

        })

    })

    describe('Get All Logs', () => {

        test('Get All Logs, status -> not 404', async () => {

            const res = await request(app).get('/logs').send({})

            expect(res.status).not.toEqual(404)

        })

        test('Get All Logs, status -> 200', async () => {

            const res = await request(app).get('/logs').send({})

            expect(res.status).toEqual(200)

        })

    })

})