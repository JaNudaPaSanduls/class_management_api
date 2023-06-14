const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
	console.log(token)
        const decode = jwt.verify(token, "react_development");
        const user = await User.findOne({ _id: decode._id, "tokens.token": token });
        if (!user) {
            throw new Error('Please Authenticate');
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports = auth;