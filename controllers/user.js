const HttpError = require('../models/http-error');

const getAllUsers = (req, res, next) => {
    res.json({message: "all users"});
}

const signUp = (req, res, next) => {
    res.json({message: "sign up user"})
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;