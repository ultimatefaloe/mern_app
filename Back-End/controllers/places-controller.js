const fs = require('fs')
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try{
        place = await Place.findById(placeId);
    } catch (err){
        console.log(err)
        const error = new HttpError('Something went wrong, could\'t get place', 500)
        return next(error)
    }

    if(!place){
        const error = new HttpError('Couldn\'t find a place with the id.', 404)
        throw error;
    }
    res.json({place: place.toObject( {getters: true})})
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try{
        places = await Place.find({creator: userId});
    } catch (err){
        console.log(err);
        const error = new HttpError('Something went wrong, couldn\'t find place with the user ID', 500);
        return next(error);
    }

    if(!places || places.length === 0 ){
        const error = new HttpError('Couldn\'t find a place with the User id.', 404);
        return next(error);
    }
    res.json({ places: places.map(p => p.toObject( {getters: true})) });
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        throw new HttpError('Invalid input passed, check the input data', 422)
    };
    
    const { title, description, address, coordinates } = req.body

    const createdPlace = new Place({
        title,
        description,
        image: req.file.path,
        address,
        location: coordinates,
        creator: req.userData.userId
    });

    let user;

    try{
        user = await User.findById(req.userData.userId)
    } catch (err){
        console.log(err);
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    };

    if(!user){
        const error = HttpError('Couldn\'t find user with the provided ID', 404);
        return next(error);
    };
   
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
        'Creating place failed, please try again.',
        500
        );
        console.log(err);
        return next(error);
    }
        
    res.status(201).json({place: createdPlace})

};

const updatePlace = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error)
        throw new HttpError('Invalid input passed, check the input data', 422)
    }
    const { title, description} = req.body;

    const placeId = req.params.pid;
    let place;

    try{
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, couldn\'t update place, try again', 500);
        return next(error);
    };

    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allow to update this place', 401);
        return next(error);
    };

    place.title = title;
    place.description = description;

    try{
        await place.save();
    } catch (err) {
        console.log(err)
        const error = new HttpError('Something went wrong, couldn\'t update place, try again', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({ getters: true })})
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try{
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        console.log(err)
        const error = new HttpError('Something went wrong, count\'t get the place. Try again.');
        return next(error)
    };

    if(!place){
        const error = new HttpError('Can not find a place with the provided ID');
        return next(error);
    };

    if(place.creator.id !== req.userData.userId){
        const error = new HttpError('You are not allow to delete this place', 401);
        return next(error);
    }

    const filePath = place.image

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session: sess});

        if(place.creator && place.creator.places){
            place.creator.places.pull(place);
            await place.creator.save({session: sess});
        };
        
        await sess.commitTransaction();
    } catch (err) {
        console.log(err)
        const error = new HttpError('Something went wrong, count\'t get the place. Try again.');
        return next(error)
    };

    fs.unlink(filePath, (err)=>{
        console.log(err);
    })

    res.status(200).json({message: `Place ${placeId} Deleted!.`})
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;