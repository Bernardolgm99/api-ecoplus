require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const server = require('../index').server;
const db = require("../models/index.js");
const Activity = db.activity
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Activity Model', () => {

    describe('Create activity', () => {

        test('Create Activity, status -> 401', async () => {

            const res = await request(app).post('/activities').send({    
                "name": "Teste-TESTE-ATIVIDADE",
                "description": "oh no",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "location": "Porto"
            })

            expect(res.status).toEqual(401)
        })

        test('Create Activity, status -> 403', async () => {

            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/activities').set('Authorization', token).send({    
                "name": "Teste-TESTE-ATIVIDADE",
                "description": "oh no",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "location": "Porto"
            })

            expect(res.status).toEqual(403)
        })

        test('Create Activity, status -> 400 (time - start / end)', async () => {

            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/activities').set('Authorization', token).send({    
                "name": "Teste-TESTE-ATIVIDADE",
                "description": "oh no",
                "start": "2023-01-02",
                "end": "2023-09-20",
                "location": "Porto"
            })

            expect(res.status).toEqual(400)
        })

        test('Create Activity, status -> 201', async () => {

            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/activities').set('Authorization', token).send({    
                "name": "Teste-TESTE-ATIVIDADE",
                "description": "oh no",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "location": "Porto"
            })

            expect(res.status).toEqual(201)
        })

    })

    describe('Get All Acitivities', () => {

        test('Get All Activities, status -> 200', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const res = await await request(app).get('/activities').set('Authorization', token).send({});

            expect(res.status).toEqual(200)
        })
    })

    describe('Get One Activity', () => {

        test('Get All Activities, status -> 404', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const res = await await request(app).get('/activities/165165168468465416847684').set('Authorization', token).send({});

            expect(res.status).toEqual(404)
        })

        test('Get All Activities, status -> 200', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const res = await await request(app).get('/activities/4').set('Authorization', token).send({});

            expect(res.status).toEqual(200)
        })

    })

    describe('Edit Activity', () => {

        test('Edit Activity, status -> 403', async () =>{
            const token = await User.findOne({ where: { id: 17 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "name": "TESTE-TESTES-YAUMASTERES"
            });

            expect(res.status).toEqual(403)
        })

        test('Edit Activity, status -> 400 (name)', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "name": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Activity, status -> 400 (description)', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "description": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Activity, status -> 400 (location)', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "location": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Activity, status -> 400 (start date)', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "start": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Activity, status -> 400 (end date)', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "end": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Activity, status -> 400 (image)', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "image": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Activity, status -> 202', async () =>{
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/activities/1').set('Authorization', token).send({
                "name": "TESTE-TESTES-YAUMASTERES"
            });

            expect(res.status).toEqual(202)
        })

    })

    describe('Delete Activity', () => {

        test('Delete Occurrence, status -> 403', async () => {
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const activity = await Activity.findOne({ where: { name: "Teste-TESTE-ATIVIDADE"}})

            const res = await request(app).delete(`/activities/${activity.id}`).set('Authorization', token).send({});

            expect(res.status).toEqual(403)
        })

        test('Delete Occurrence, status -> 200', async () => {
            const token = await User.findOne({ where: { id: 12 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const activity = await Activity.findOne({ where: { name: "Teste-TESTE-ATIVIDADE"}})

            const res = await request(app).delete(`/activities/${activity.id}`).set('Authorization', token).send({});

            expect(res.status).toEqual(200)
        })

    })

    describe('Subscribe', () => {

        test('Subscribe an Activity, status -> 401', async () => {
           
            const res = await request(app).post('/activities/1/users').send({});
    
            expect(res.status).toBe(401) 

        })

        test('Subscribe an Activity, status -> 404', async () => {
           
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/activities/54645635345346454654/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(404) 

        })

        test('Subscribe an Activity, status -> 200', async () => {
           
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/activities/1/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(200) 

        })

    })

    describe('Unsubscribe', () => {

        test('Unsubscribe an Activity, status -> 401', async () => {
           
            const res = await request(app).delete('/activities/1/users').send({});
    
            expect(res.status).toBe(401) 

        })

        test('Unsubscribe an Activity, status -> 404', async () => {
           
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).delete('/activities/54645635345346454654/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(404) 

        })

        test('Unsubscribe an Activity, status -> 200', async () => {
           
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).delete('/activities/1/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(200) 

        })
        
    })

    describe('Get All Subscriptions', () => {

        test('Unsubscribe an Activity, status -> 404', async () => {
           
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).get('/activities/54645635345346454654/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(404) 

        })

        test('Unsubscribe an Activity, status -> 200', async () => {
           
            const token = await User.findOne({ where: { id: 11 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).get('/activities/1/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(200) 

        })

    })

})