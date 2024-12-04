const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');

const { v4: uuidv4 } = require('uuid');
const User = require('../models/user')


const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
    let users;

    try{
        users = await User.find({}, '-password')
    } catch (err){
        console.log(err);
        const error = new HttpError('Fetching users failed, please try again later.', 500);
        return next(error)
    };

    if(!users || users.length === 0){
        const error = new HttpError('No users found.', 404);
        return next(error);
    };

    res.status(200).json({users: users.map(u => u.toObject({getters:true}))})
}

const signUp = async (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next( new HttpError('Invalid input passed, check the input data', 422));
    };

    const { name, email, password } = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later.', 500)
        return next(error);
    };

    if (existingUser) {
        const error = new HttpError('Email already exists. Please log in instead.', 422);
        return next(error);
    };

    let hashPassword;

    try{
        hashPassword = await bcrypt.hash(password, 12);
    } catch(err){
        console.log(err)
        const error = new HttpError('Something went wrong, couldn\'t sign up user, try again.');
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashPassword,
        image: req.file.path,
        places: []
    })

    try{
        await createdUser.save();
    } catch (err){
        const error = new HttpError('Something went wrong, couldn\'t sign up user, try again.');
        return next(error);
    }

    let token;

    try {
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_TOKEN_KEY, {expiresIn: '1h'});
    } catch (err) {
        const error = new HttpError('Something went wrong, couldn\'t sign up user, try again.');
        return next(error);
    };

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token})
}

const login = async(req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next ( new HttpError('Couldn\'t find any match user data, check the input data', 422))
    };

    const { email, password } = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        console.log(err);
        const error = new HttpError('Invalid Login Credentials.', 500)
        return next(error);
    };

    if(!existingUser){
        const error = new HttpError('Invalid Login Credentials.', 401);
        return next(error);
    };

    let verifyPassword = false;
    try {
        verifyPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Invalid Login Credentials.', 401);
        return next(error);
    }

    if(!verifyPassword){
        const error = new HttpError('Could not log you in, invalid login credentials, try again.', 401);
        return next(error);
    };

    let token;

    try {
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_TOKEN_KEY, {expiresIn: '1h'});
    } catch (err) {
        const error = new HttpError('Something went wrong, couldn\'t sign up user, try again.');
        return next(error);
    };

    res.status(200).json({userId: existingUser.id, email: existingUser.email, token: token})
};

exports.signUp = signUp;
exports.login = login;
exports.getUsers = getUsers;