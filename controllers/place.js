const HttpError = require('../models/http-error');
const User = require('../models/user');
const Place = require('../models/place');
const mongoose = require('mongoose');


const getAllPlaces = async (req, res, next)=>{
    let places;
    try {
        places = await Place.find()
    }catch(err){
        console.log(err);
        return next(new HttpError("Error server....", 500));
    }
    if(!places.length){
        return next(new HttpError("No place....", 402));
    }
    res.json( places);
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

const deletePlace = async (req, res, next) => {
    const placeId = req.params.id;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    }catch(err){
        return next(new HttpError("Something went wrong1....", 500));
    }
    if(!place){
        return next(new HttpError("NO such place....", 404));
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();

    }catch(err){
        console.log(err);
        return next(new HttpError("Something went wrong....", 500));
    }

    res.json({success: true, message: "Successfully deleted a Place."})
}

exports.getAllPlaces = getAllPlaces;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;