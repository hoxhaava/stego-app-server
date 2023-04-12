const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../../index.js');
const User = require('../../../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Create a test user for auth tests
let testUser = {};
beforeAll(async () => {
    testUser = await User.create('test', 'test@example.com', 'password', 'token');
});

// Signup route tests
describe('POST /signup', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password'
            })
            .expect(201);

        expect(response.body.user.id).toBeDefined();
        expect(response.body.user.name).toEqual('John Doe');
        expect(response.body.user.email).toEqual('johndoe@example.com');
    });

    it('should return an error when signing up with an existing email', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'test',
                email: 'test@example.com',
                password: 'password'
            })
            .expect(422);

        expect(response.text).toEqual('Email address already in use');
    });
});

// Signin route tests
describe('POST /signin', () => {
    it('should sign in a user', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'test@example.com',
                password: 'password'
            })
            .expect(200);

        expect(response.body.user.email).toEqual('test@example.com');
        expect(response.body.token).toBeDefined();

    });

    it('should return an error when signing in with an invalid email', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'invalidemail@example.com',
                password: 'password'
            })
            .expect(401);

        expect(response.body.error).toEqual('Invalid email or password!');
    });

    it('should return an error when signing in with an invalid password', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'test@example.com',
                password: 'invalidpassword'
            })
            .expect(401);

        expect(response.body.error).toEqual('Invalid email or password!');
    });

    it('should return an error when not providing an email or password', async () => {
        const response = await request(app)
            .post('/signin')
            .send({})
            .expect(401);

        expect(response.body.error).toEqual('Must provide email and password!');
    });
});