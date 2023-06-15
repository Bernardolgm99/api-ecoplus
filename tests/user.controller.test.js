require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const db = require("../models/index.js");
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");


describe('Users Model', () => {
    
    describe('Create User', () => {

        test('Create a New User, status -> 400 (username)', async () => {
            const res = await request(app).post('/users').send({
                "name": "Rui Bola de Fogo",
                "email": "fuego12@gmail.com",
                "password": "12345",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "contact": 911537599,
                "schoolDesc": "Escola EB da Trofa"
            });
            
                expect(res.statusCode).toEqual(400)
        })
            
        test('Create a New User, status -> 400 (name)', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "email": "fuego12@gmail.com",
                "password": "12345",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "contact": 911537599,
                "schoolDesc": "Escola EB da Trofa"
            });
            
            expect(res.statusCode).toEqual(400)
        })

        test('Create a New User, status -> 400 (email)', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "name": "Rui Bola de Fogo",
                "password": "12345",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "contact": 911537599,
                "schoolDesc": "Escola EB da Trofa"
            });
            
            expect(res.statusCode).toEqual(400)
        })
        
        test('Create a New User, status -> 400 (password)', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "name": "Rui Bola de Fogo",
                "email": "fuego12@gmail.com",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "contact": 911537599,
                "schoolDesc": "Escola EB da Trofa"
            });
            
            expect(res.statusCode).toEqual(400)
        })
        
        test('Create a New User, status -> 400 (birthDate)', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "name": "Rui Bola de Fogo",
                "email": "fuego12@gmail.com",
                "password": "12345",
                "genreDesc": "M",
                "contact": 911537599,
                "schoolDesc": "Escola EB da Trofa"
            });
            
            expect(res.statusCode).toEqual(400)
        })

        test('Create a New User, status -> 400 (contact)', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "name": "Rui Bola de Fogo",
                "email": "fuego12@gmail.com",
                "password": "12345",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "schoolDesc": "Escola EB da Trofa"
            });
            
            expect(res.statusCode).toEqual(400)
        })
        
        test('Create a New User, status -> 400 (schoolDesc)', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "name": "Rui Bola de Fogo",
                "email": "fuego12@gmail.com",
                "password": "12345",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "contact": 911537599,
            });
            
            expect(res.statusCode).toEqual(400)
        })

        test('Create a New User, status -> 201', async () => {
            const res = await request(app).post('/users').send({
                "username": "fuego12",
                "name": "Rui Bola de Fogo",
                "email": "fuego12@gmail.com",
                "password": "12345",
                "genreDesc": "M",
                "birthDate" : "12/05/2002",
                "contact": 911537599,
                "schoolDesc": "Escola EB da Trofa"
            });
            
            expect(res.statusCode).toEqual(201);
        })

    })

    describe('Delete User', () => {
        
        test('Delete Created User, status -> 200', async () => {
            const username = await User.findOne({ where: {username: 'fuego12'}})
            
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const res = await request(app).delete(`/users/${username.id}`).set('Authorization', token).send({});
    
            expect(res.statusCode).not.toEqual(403)
        })

    })
    
    describe('Get All Users', () => {

        test('Get All Users, status -> 200', async () => {
            const res = await request(app).get('/users').send({})
        
            expect(res.statusCode).toEqual(200)
        })
    })

    describe('Get One User', () => {

        test('Get One Impossible User, status -> 404', async () => {
            const res = await request(app).get('/users/121564165465165412132').send({})

            expect(res.statusCode).toEqual(404)
        })

        test('Get One Possible User, status -> 200', async () => {
            const res = await request(app).get('/users/12').send({})

            expect(res.statusCode).toEqual(200)
        })
    })

    describe('Login', () => {

        test('Login without body, status -> !200', async () => {
            const res = await request(app).post('/users/login').send({})
            
            expect(res.statusCode).not.toEqual(200)
        })

        test('Login without username, status -> !200', async () => {
            const res = await request(app).post('/users/login').send({
                "password": "admin"
            })
            
            expect(res.statusCode).not.toEqual(200)
        })

        test('Login without password, status -> !200', async () => {
            const res = await request(app).post('/users/login').send({
                "username": "admin"
            })
            
            expect(res.statusCode).not.toEqual(200)
        })

        test('Login normal User, status -> 200', async () => {
            const res = await request(app).post('/users/login').send({
                "username": "yaumaster",
                "password": "12345"
            })

            expect(res.statusCode).toEqual(200)
        })

        test('Login Admin, status -> 200', async () => {
            const res = await request(app).post('/users/login').send({
            "username": "admin",
            "password": "admin"
        })

            expect(res.statusCode).toEqual(200)
        })
    })

    describe('Edit User', () => {

        test('Edit an Impossible User, status -> 404', async () => {
            const res = await request(app).get('/users/1541618616142452').send({
                "contact": 911123321
            })

            expect(res.statusCode).toEqual(404)
        })

        test('Edit a Random User, status -> 401', async () => {
            const res = await request(app).put('/users/10').send({
                "contact": 911123321
            })

            expect(res.statusCode).toEqual(401)
        })

        test('Edit My User, status -> 400 (typeof String instead of Number)', async () => {
            const res = await request(app).put('/users/12').send({
                "contact": 911123321
            })

            expect(res.statusCode).not.toEqual(202)
        })

        test('Edit My User, status -> 202', async () => {

            const token = await User.findOne({ where: { id: 2 } })
                .then(user => {
                    return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                    });
                });

            const res = await request(app).put('/users/12').set('Authorization', token).send({
                "schoolDesc": "Escola EB da Trofa"
            })

            expect(res.statusCode).toEqual(202)
        })
    })

    describe('Block User', () => {

        test('Block User, status -> 403 (Not Admin)', async () => {

            const token = await User.findOne({ where: { id: 1 } })
                .then(user => {
                    return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                    });
                });

            const res = await request(app).patch('/users/11').set('Authorization', token).send({
                "block": true
            })

            expect(res.statusCode).toEqual(403)
        })

        test('Block a Unnamed User, status -> 404', async () => {

            const token = await User.findOne({ where: { id: 2 } })
                .then(user => {
                    return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                    });
                });

            const res = await request(app).patch('/users/116546844616841618').set('Authorization', token).send({
                "block": true
            })

            expect(res.statusCode).toEqual(404)
        })

        test('Block User, status -> 400 (String instead of Boolean)', async () => {

            const token = await User.findOne({ where: { id: 2 } })
                .then(user => {
                    return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                    });
                });

            const res = await request(app).patch('/users/11').set('Authorization', token).send({
                "block": "true"
            })

            expect(res.statusCode).toEqual(400)
        })

        test('Block User, status -> 202', async () => {

            const token = await User.findOne({ where: { id: 2 } })
                .then(user => {
                    return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                    });
                });

            const res = await request(app).patch('/users/11').set('Authorization', token).send({
                "block": true
            })

            expect(res.statusCode).toEqual(202)
        })

    })

})
