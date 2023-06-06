require('dotenv').config();
const request = require('supertest')
const db = require('../models/index');
const Rating = db.rating
const User = db.user
const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config");
const app = require('../index');

describe('Rating Model', () => {

    describe('Create Rating', () => {

        test('Create Rating, status -> 200', async () => {
            const token = await User.findOne({ where: { id: 12 } })
                  .then(user => {
                        return jwt.sign({ id: user.id, role: user.role },
                              config.SECRET, {
                              expiresIn: '24h' // 24 hours
                        });
                  });
            
            const res = await request(app).put('/occurrences/11/comments/175/rating').set('Authorization', token).send({
            "rating": true
            });

            expect(res.status).toEqual(200)
            
        })

    })

    describe('Update Rating', () => {

        test('Create Rating, status -> 200', async () => {
            const token = await User.findOne({ where: { id: 12 } })
                  .then(user => {
                        return jwt.sign({ id: user.id, role: user.role },
                              config.SECRET, {
                              expiresIn: '24h' // 24 hours
                        });
                  });
            
            const res = await request(app).put('/occurrences/11/comments/175/rating').set('Authorization', token).send({
            "rating": true
            });

            expect(res.status).toEqual(200)
            
        })
        
    })

    describe('Delete Rating', () => {
        
        test('Delete Rating, status -> 200', async () => {
            
            const token = await User.findOne({ where: { id: 12 } })
                .then(user => {
                    return jwt.sign({ id: user.id, role: user.role },
                            config.SECRET, {
                            expiresIn: '24h' // 24 hours
                    });
                });
            
            const res = await request(app).patch('/occurrences/11/comments/175/rating').set('Authorization', token).send({});
        
            expect(res.status).toEqual(200)
        })
    })

    describe('Get All Ratings', () => {

        test('Get All Ratings', async () => {
            const res = await request(app).get('/occurrences/11/comments/146/rating').send({});
            
            expect(res.status).toEqual(200)
        })

    })

})