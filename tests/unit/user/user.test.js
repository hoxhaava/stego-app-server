const User = require('../../../models/user');
const bcrypt = require('bcrypt');

describe('User model functions', () => {
    let user;

    beforeEach(() => {
        // Create a new user before each test
        user = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            authToken: null,
        };
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const newUser = await User.create(user.name, user.email, user.password, user.authToken);

            expect(newUser.name).toBe(user.name);
            expect(newUser.email).toBe(user.email);
            expect(await bcrypt.compare(user.password, newUser.hashedPassword)).toBe(true);
            expect(newUser.authToken).toBe(user.authToken);
            expect(newUser.id).toBeDefined();
        });
    });

    describe('getAll', () => {
        it('should return all users', async () => {
            const users = await User.getAll();

            expect(users).toBeDefined();
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
        });
    });

    describe('findByEmail', () => {
        it('should return a user by email', async () => {
            const email = 'johndoe@example.com';
            const foundUser = await User.findByEmail(email);

            expect(foundUser.email).toBe(email);
        });

        it('should return null if user is not found', async () => {
            const email = 'nonexistentuser@example.com';
            const foundUser = await User.findByEmail(email);

            expect(foundUser).toBeNull();
        });
    });

    describe('findById', () => {
        it('should return a user by id', async () => {
            const userId = 1;
            const foundUser = await User.findById(userId);

            expect(foundUser.id).toBe(userId);
        });

        it('should return null if user is not found', async () => {
            const userId = 1000;
            const foundUser = await User.findById(userId);

            expect(foundUser).toBeNull();
        });
    });

    describe('updateAuthToken', () => {
        it('should update the auth token for a user', async () => {
            const id = 1;
            const token = 'newAuthToken123';
            const result = await User.updateAuthToken(id, token);

            expect(result).toBe(true);
        });
    });
});