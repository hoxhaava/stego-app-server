const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        console.log(user)
        if (!user || user.authToken !== token) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = authMiddleware;