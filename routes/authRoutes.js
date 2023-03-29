const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware')
require('dotenv').config();


router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            return res.status(422).send('Email address already in use');
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET);

        const newUser = await User.create(name, email, password, token);

        res.status(201).send({ user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// /signin route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).send({ error: 'Must provide email and password!' });
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).send({ error: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid email or password!' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        await User.updateAuthToken(user.id, token);

        res.send({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// /logout route
router.post('/logout/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.deleteToken(userId);

        res.send('Logged out successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router