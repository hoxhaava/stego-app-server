const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Get a user by id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (typeof req.params.id === 'undefined') {
            return res.status(400).send('Bad Request: ID parameter is missing');
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
