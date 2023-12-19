const HttpError = require('../models/http-error');
const User = require('../models/user');

const signUp = async (req, res, next) => {
    const {name, email, password} = req.body;
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
        password,
        image: 'no image',
        places: []
    })
    try{
        await newUser.save();
       }catch(error){
        console.log(error);
        const err = new HttpError('Could not sign up try again...', 500);
        return next(err);
       }
    res.json({message: 'saved user'});
}

const getAllUsers = async (req, res, next) => {
    const users = await User.find()

    res.json(users.map(u => u.toObject({getters: true})));
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;