const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dev = require('../config/index');

const signUp = async (req, res, next) => {
    const {name, email, password} = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(error){
        const err = new HttpError('Something went wrong in server...', 500);
        return next(err);
       }
    let existUser;
   try{
    existUser = await User.find({email: email});
   }catch(error){
    const err = new HttpError('User Already exists...', 401);
    return next(err);
   }
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        image: 'no image',
        places: []
    })
    let token;
    try{
        token = jwt.sign({userId: newUser.id, email: newUser.email}, dev.app.jwtSecretKey, {expiresIn: '1h'});
    }catch(error){
        console.log(error);
        const err = new HttpError('Could not sign up try again...', 500);
        return next(err);
       }
    try{
        await newUser.save();
       }catch(error){
        console.log(error);
        const err = new HttpError('Could not sign up try again...', 500);
        return next(err);
       }
    res.json({userId: newUser.id, email: newUser.email, token});
}

const getAllUsers = async (req, res, next) => {
    const users = await User.find()

    res.json(users.map(u => u.toObject({getters: true})));
}

const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new HttpError('No such user Found', 401))
    }
    try{
        await User.findByIdAndDelete(req.params.id);
    }catch(err){
        return next(new HttpError('Server error...', 500));
    }

    res.json({success: true, message: 'Successfully deleted user'});
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({email: email});
    }catch(err){
        return next(new HttpError('Server error...', 500));
    }
    if(!user){
        return next(new HttpError('Wrong credentials.. try again', 401))
    }
    let passwordMatched = false;
    try{
        passwordMatched = await bcrypt.compare(password, user.password);
    }catch(error){
        return next(new HttpError('Server error...', 500));
   }
   if(!passwordMatched){
    return next(new HttpError('Wrong credentials.. try again', 401))
   }
   let token;
   try {
    token = jwt.sign({userId: user.id, email: user.email}, dev.app.jwtSecretKey, {expiresIn: '1h'});
   }catch(error){
        console.log(error);
        const err = new HttpError('Could not login try again...', 500);
        return next(err);
       }

     res.json({userId: user.id, email: user.email, token});
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;