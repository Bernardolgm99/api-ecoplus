require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const db = require("../models/index.js");
const Occurrence = db.occurrence
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Occurrences Model', () => {

    describe('Create a New Occurrence', () => {

        test('Create a New Occurence, status -> 401 (No Token Found)', async () => {
            
            const token = ''

            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Quadro sujo",
                "description": "Quadro sujo na sala B208",
                "location": "Vila do Conde", 
                "image": {}
            });

            expect(res.statusCode).toEqual(401)
        })

        test('Create a New Occurrence, status -> 400 (name)', async () => {
            
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "description": "Quadro sujo na sala B208",
                "location": "Vila do Conde", 
                "image": {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create a New Occurrence, status -> 400 (description)', async () => {
            
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Quadro sujo",
                "location": "Vila do Conde", 
                "image": {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create a New Occurrence, status -> 400 (location)', async () => {
            
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Quadro sujo",
                "description": "Quadro sujo na sala B208",
                "image": {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create a New Occurrence, status -> 400 (image)', async () => {
            
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Quadro sujo",
                "description": "Quadro sujo na sala B208",
                "location": "Vila do Conde", 
            });

            expect(res.status).toEqual(400)
        })

        //415 Não funciona

        test('Create a New Occurrence, status -> 415', async () => {
            
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Quadro sujo",
                "description": "Quadro sujo na sala B208",
                "location": "Vila do Conde", 
                "image": 156169516519646
            });

            expect(res.status).toEqual(415)
        })

        test('Create a New Occurrence, status -> 201', async () => {
            
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences').set('Authorization', token).send({
                "name": "Quadro sujo",
                "description": "Quadro sujo na sala B208",
                "location": "Vila do Conde", 
                "image": {}
            });

            expect(res.status).toEqual(201)
        })

    })

    describe('Get All Users', () => {

        test('Get Five Users, status -> 200', async () => {

            const res = await request(app).get('/occurrences').send({});

            expect(res.status).toEqual(200)
        })

    })

    describe('Get One Occurrence', () => {

        test('Get One Occurrence, status -> 404', async () => {

            const res = await request(app).get('/occurrences/3163514651321654').send({});

            expect(res.status).not.toEqual(200)
        })

        test('Get One Occurrence, status -> 200', async () => {

            const res = await request(app).get('/occurrences/11').send({});

            expect(res.status).toEqual(200)
        })
    })

    describe('Delete Occurrence', () => {

        test('Delete Occurrence, status -> 403', async () => {
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).post('/occurrences/12').set('Authorization', token).send({});

            expect(res.status).not.toEqual(200)
        })

        test('Delete Occurrence, status -> 200', async () => {
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const occurrence = await Occurrence.findOne({ where: { description: "Quadro sujo na sala B208"}})

            const res = await request(app).post(`/occurrences/${occurrence.id}`).set('Authorization', token).send({});

            expect(res.status).toEqual(200)
        })

    })

    describe('Edit Occurrence Status', () => {

        test('Edit Occurrence Status, status -> 403', async () => {
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).patch('/occurrences/11').set('Authorization', token).send({
                "status": 0
            });

            expect(res.status).toEqual(403)
        })

        test('Edit Occurrence Status, status -> 401', async () => {
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).patch('/occurrences/11').set('Authorization', token).send({});

            expect(res.status).toEqual(400)
        })

        test('Edit Occurrence Status, status -> 401', async () => {

            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).patch('/occurrences/11').set('Authorization', token).send({
                "status": 5
            });

            expect(res.status).toEqual(400)

        })

        test('Edit Occurrence Status, status -> 200', async () => {
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).patch('/occurrences/11').set('Authorization', token).send({
                "status": 0
            });

            expect(res.status).toEqual(200)
        })

    })

    describe('Edit Occurrence', () => {

        test('Edit Occurrence, status -> 403', async () =>{
            const token = await User.findOne({ where: { id: 17 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/occurrences/11').set('Authorization', token).send({
                "name": "Pandas"
            });

            expect(res.status).toEqual(403)
        })

        test('Edit Occurrence, status -> 400 (name)', async () =>{
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/occurrences/11').set('Authorization', token).send({
                "name": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Occurrence, status -> 400 (description)', async () =>{
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/occurrences/11').set('Authorization', token).send({
                "description": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Occurrence, status -> 400 (location)', async () =>{
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/occurrences/11').set('Authorization', token).send({
                "location": true
            });

            expect(res.status).toEqual(400)
        })

        //Verificação não funciona de todo, imagem -> objeto ?

        test('Edit Occurrence, status -> 400 (image)', async () =>{
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/occurrences/11').set('Authorization', token).send({
                "image": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Occurrence, status -> 200', async () =>{
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/occurrences/11').set('Authorization', token).send({
                "name": "Quadro sujo com tinta"
            });

            expect(res.status).toEqual(200)
        })

    })

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
                "description": "Filme muito top."
            });

            expect(res.status).toEqual(201)

        })


    })

})