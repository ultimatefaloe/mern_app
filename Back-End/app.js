const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRouter = require('./Routes/places-routes');
const usersRouter = require('./Routes/users-routes')
const HttpError = require('./models/http-error')

const app = express();

app.use(bodyParser.json());

app.use('/Uploads/Images', express.static(path.join('Uploads', 'Images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/places', placesRouter);

app.use('/api/users', usersRouter);

app.use((req, res, next)=>{
    const error = new HttpError('Couldn\'t find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, (err)=>{
            console.log(err)
        })
    }
    if(res.headerSent){
        return next(error)
    };

    res.status(error.code || 500).json({message: error.message || 'An unknown error occurred!'})
})


mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWAASORD_KEY}@cluster0.ftix1.mongodb.net/${process.env.DB_TABLE_NAME}?retryWrites=true&w=majority&appName=Cluster0`
).then(()=>{ 
    console.log('Connection Successful.!');
    app.listen(5000);
}).catch( err => {
    console.error(err && 'Connection failed');
});