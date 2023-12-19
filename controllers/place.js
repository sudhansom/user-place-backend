const HttpError = require('../models/http-error');
const User = require('../models/user');
const Place = require('../models/place');
const mongoose = require('mongoose');


const getAllPlaces = (req, res, next)=>{
    res.json({message: 'get all places.'})
}

const createPlace = async (req, res, next) => {
    const { title, description, creator  } = req.body;

    const newPlace = new Place({
        title,
        description,
        address: 'Lalim',
        image: 'no-image',
        location: {
            lat: 2222,
            lng: -333
        },
        creator
    })

    let user;
    try {
        user = await User.findById(creator);
    }catch(err){
        console.log(err);
        return next(new HttpError("Creating Place Failed....", 500));
    }
    if(!user){
        return next(new HttpError('No Such User...', 401));
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save({session: sess});
        user.places.push(newPlace);
        await user.save({session: sess});
        await sess.commitTransaction();

    }catch(err){
        console.log(err);
        return next(new HttpError("Creating Place Failed....", 500));
    }
    res.json({success: true, message: 'created place and assigned to the user.'})

}

exports.getAllPlaces = getAllPlaces;
exports.createPlace = createPlace;