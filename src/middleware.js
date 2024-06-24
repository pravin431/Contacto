const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
