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
    if(!user || user.password !== password){
        return next(new HttpError('Wrong credentials.. try again', 401))
    }
    res.json({success: true, message: "login successfull..."})
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;