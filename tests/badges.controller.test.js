require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const db = require("../models/index.js");
const Badge = db.badge
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Badges Model', () => {

    describe('Create New Badge', () => {

        test('Create Badge, status -> 401', async () => {

            const res = await request(app).post('/badges').send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "description": "Muitos Dinheiros Investidos",
                "conditionType": "occurrence",
                "value": 1,
                "logo": {}
            })

            expect(res.status).toEqual(401)
        })

        test('Create Badge, status -> 403', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await await request(app).post('/badges').set('Authorization', token).send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "description": "Muitos Dinheiros Investidos",
                "conditionType": "occurrence",
                "value": 1,
                "logo": {}
            })

            expect(res.status).toEqual(403)

        })

        test('Create Badge, status -> 400 (name)', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/badges').set('Authorization', token).send({    
                "description": "Muitos Dinheiros Investidos",
                "conditionType": "occurrence",
                "value": 1,
                "logo": {}
            })

            expect(res.status).toEqual(400)

        })

        test('Create Badge, status -> 400 (description)', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/badges').set('Authorization', token).send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "conditionType": "occurrence",
                "value": 1,
                "logo": {}
            })

            expect(res.status).toEqual(400)

        })

        test('Create Badge, status -> 400 (conditionType)', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/badges').set('Authorization', token).send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "description": "Muitos Dinheiros Investidos",
                "value": 1,
                "logo": {}
            })

            expect(res.status).toEqual(400)

        })

        test('Create Badge, status -> 400 (value)', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/badges').set('Authorization', token).send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "description": "Muitos Dinheiros Investidos",
                "conditionType": "occurrence",
                "logo": {}
            })

            expect(res.status).toEqual(400)

        })

        test('Create Badge, status -> 400 (logo)', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/badges').set('Authorization', token).send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "description": "Muitos Dinheiros Investidos",
                "conditionType": "occurrence",
                "value": 1,
            })

            expect(res.status).toEqual(400)

        })

        test('Create Badge, status -> 201', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/badges').set('Authorization', token).send({    
                "name": "Crypto Master & Coin Omega Slayer",
                "description": "Muitos Dinheiros Investidos",
                "conditionType": "occurrence",
                "value": 1,
                "logo": {}
            })

            expect(res.status).toEqual(201)

        })
    })

    describe('Get All Badges', () => {

        test('Get All Badges, status -> not toBe 404', async () => {

            const res = await request(app).get('/badges').send({})

            expect(res.status).not.toEqual(404)

        })

        test('Get All Badges, status -> 200', async () => {

            const res = await request(app).get('/badges').send({})

            expect(res.status).toEqual(200)

        })

    })

    describe('Get One Badge', () => {

        test('Get One Badge, status -> 404', async () => {

            const res = await request(app).get('/badges/561616181651654165165').send({})

            expect(res.status).toEqual(404)

        })

        test('Get One Badge, status -> 200', async () => {

            const res = await request(app).get('/badges/1').send({})

            expect(res.status).toEqual(200)

        })

    })

    describe('Delete Badge', () => {

        test('Delete Badge, status -> 401', async () => {

            const badge = await Badge.findOne({where: {name: "Crypto Master & Coin Omega Slayer"}})

            const res = await request(app).delete(`/badges/${badge.id}`).send({})

            expect(res.status).toEqual(401)

        })

        test('Delete Badge, status -> 403', async () => {

            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const badge = await Badge.findOne({where: {name: "Crypto Master & Coin Omega Slayer"}})

            const res = await request(app).delete(`/badges/${badge.id}`).set('Authorization', token).send({})

            expect(res.status).toEqual(403)

        })

        test('Delete Badge, status -> 200', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const badge = await Badge.findOne({where: {name: "Crypto Master & Coin Omega Slayer"}})

            const res = await request(app).delete(`/badges/${badge.id}`).set('Authorization', token).send({})

            expect(res.status).toEqual(200)

        })

    })

    describe('Verify Event - Badge Function', () => {

    })

    describe('Verify Activity - Badge Function', () => {
        
    })

    describe('Verify Occurrence - Badge Function', () => {
        
    })

    describe('Verify Comment - Badge Function', () => {
        
    })

})