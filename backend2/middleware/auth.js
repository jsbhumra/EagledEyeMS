const jwt = require('jsonwebtoken');
const User = require("../models/user");
const mongoose = require('mongoose');

module.exports = async function (token) {
    // const token = req.headers['x-auth-token'];
    if (!token) return({status: 401, message: 'Access denied. No token provided.'});

    try{
        const decoded = jwt.verify(token, 'your_secret_key');
        const userExists = await User.findById(decoded.userId);
        if (!userExists) return({ status: 401, message: 'User not found. Please log in again.'});
        else return({ status: 200, message: userExists })
    } catch(err) {
        return({ status: 401, message: err+" - Invalid Token!"})
    }
}