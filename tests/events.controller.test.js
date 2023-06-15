require('dotenv').config();
const request = require('supertest')
const app = require('../index');
const db = require("../models/index.js");
const Event = db.event
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");

describe('Event Model', () => {

    describe('Create Event', () => {

        test('Create event, status -> 403', async () => {
            
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({    
                "name": "Teste-TESTES",
                "subtitle": "EZ-TESTES",
                "description": "oh no",
                "location": "Porto",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "file" : {},
                "image" : {},
            });

            expect(res.status).toEqual(403)

        })

        test('Create event, status -> 400 (name)', async () => {
            
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({
                "description": "oh no",
                "subtitle": "EZ-TESTES",
                "location": "Porto",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "file" : {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create event, status -> 400 (description)', async () => {

            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({
                "name": "Teste-TESTES",
                "subtitle": "EZ-TESTES",
                "location": "Porto",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "file" : {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create event, status -> 400 (location)', async () => {
            
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({
                "name": "Teste-TESTES",
                "subtitle": "EZ-TESTES",
                "description": "oh no",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "file" : {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create event, status -> 400 (file/image)', async () => {
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({
                "name": "Teste-TESTES",
                "subtitle": "EZ-TESTES",
                "description": "oh no",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "location": "Porto",
            });

            expect(res.status).toEqual(400)
        })

        test('Create event, status -> 400 (subtitle)', async () => {
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({
                "name": "Teste-TESTES",
                "description": "oh no",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "location": "Porto",
                "image": {},
                "file" : {}
            });

            expect(res.status).toEqual(400)
        })

        test('Create event, status -> 201', async () => {
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events').set('Authorization', token).send({
                "name": "Teste-TESTES",
                "subtitle": "EZ-TESTES",
                "description": "oh no",
                "location": "Porto",
                "start": "2023-09-15",
                "end": "2023-09-20",
                "image": {},
                "file" : {}
            });

            expect(res.status).toEqual(201)
        })

    })

    describe('Get All Events', () => {
        
        test('Get Five Events, status -> 200', async () => {

            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const res = await await request(app).get('/events').set('Authorization', token).send({});

            expect(res.status).toEqual(200)
        })
    })

    describe('Get One Event', () => {
        
        test('Get One Event, status -> 404', async () => {

            const res = await request(app).get('/events/3163514651321654').send({});

            expect(res.status).not.toEqual(200)
        })

        test('Get One Event, status -> 200', async () => {

            const res = await request(app).get('/events/6').send({});

            expect(res.status).toEqual(200)
        })
    })

    describe('Edit Event', () => {
        
        test('Edit Events, status -> 403', async () =>{
            const token = await User.findOne({ where: { id: 17 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/events/6').set('Authorization', token).send({
                "name": "Pandas"
            });

            expect(res.status).toEqual(403)
        })

        test('Edit Events, status -> 400 (name)', async () =>{
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/events/6').set('Authorization', token).send({
                "name": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Events, status -> 400 (description)', async () =>{
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/events/6').set('Authorization', token).send({
                "description": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Events, status -> 400 (location)', async () =>{
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/events/6').set('Authorization', token).send({
                "location": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Events, status -> 400 (subtitle)', async () =>{
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/events/6').set('Authorization', token).send({
                "subtitle": true
            });

            expect(res.status).toEqual(400)
        })

        test('Edit Events, status -> 200', async () =>{
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });
            
            const res = await request(app).put('/events/6').set('Authorization', token).send({
                "name": "Event goes prrrrrrrrrr"
            });

            expect(res.status).toEqual(200)
        })

    })

    describe('Delete Event', () => {

        test('Delete Occurrence, status -> 401', async () => {
            
            const res = await request(app).delete('/events/12').send({});

            expect(res.status).toBe(401)
        })

        test('Delete Occurrence, status -> 200', async () => {
            const token = await User.findOne({ where: { id: 2 } })
            .then(user => {
                return jwt.sign({ id: user.id, role: user.role },
                    config.SECRET, {
                    expiresIn: '24h' // 24 hours
                });
            });

            const event = await Event.findOne({ where: { name: "Teste-TESTES"}})

            const res = await request(app).delete(`/events/${event.id}`).set('Authorization', token).send({});

            expect(res.status).toEqual(200)
        })

    })

    describe('Subscribe', () => {
        
        test('Subscribe an Event, status -> 401', async () => {
           
            const res = await request(app).post('/events/6/users').send({});
    
            expect(res.status).toBe(401) 

        })

        test('Subscribe an Event, status -> 404', async () => {
           
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events/54645635345346454654/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(404) 

        })

        test('Subscribe an Event, status -> 200', async () => {
           
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).post('/events/6/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(200) 

        })

    })

    describe('Unsubscribe', () => {
       
        test('Unsubscribe an Event, status -> 401', async () => {
           
            const res = await request(app).delete('/events/6/users').send({});
    
            expect(res.status).toBe(401) 

        })

        test('Unsubscribe an Event, status -> 404', async () => {
           
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).delete('/events/54645635345346454654/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(404) 

        })

        test('Unsubscribe an Event, status -> 200', async () => {
           
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).delete('/events/6/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(200) 

        })
    })

    describe('Get All Subscriptions', () => {
        
        test('Unsubscribe an Event, status -> 404', async () => {
           
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).get('/events/54645635345346454654/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(404) 

        })

        test('Unsubscribe an Event, status -> 200', async () => {
           
            const token = await User.findOne({ where: { id: 1 } })
            .then(user => {
                  return jwt.sign({ id: user.id, role: user.role },
                        config.SECRET, {
                        expiresIn: '24h' // 24 hours
                  });
            });

            const res = await request(app).get('/events/6/users').set('Authorization', token).send({});
    
            expect(res.status).toBe(200) 

        })
    })

})