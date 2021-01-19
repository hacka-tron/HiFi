const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const URI = `mongodb+srv://bpower2009:${process.env.MONGO_PW}@cluster0.2wvrq.mongodb.net/hifi?retryWrites=true&w=majority`;

const helpers = require('./helpers');
const HifiQuery = require('./models/hifiQuery')

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('Connected to database!');
}).catch((error) => {
    console.log('Connection failed')
    console.log(error);
})

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

//Set the headers in http requests so that things work correctly
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

app.get('/', (req, res) => {
    res.send('Connected to Server')
});

app.post('/api/hifi', async(req, res) => {
    var otherHifi;
    if (otherHifi = (await HifiQuery.find({ otherCountry: { $exists: false } }).sort({ added: 1 }).limit(1))[0]) {
        HifiQuery.findOneAndUpdate({ _id: otherHifi._id }, { $set: { otherCountry: req.body.country } }).then(() => {
            res.send({ country: otherHifi.country });
        })
    } else {
        const query = new HifiQuery({
            country: req.body.country,
            added: Date.now()
        })
        query.save().then(async(query) => {
            var queryUpdated;
            while (queryUpdated = await HifiQuery.findOne(query._id)) {
                if (queryUpdated.otherCountry) {
                    await HifiQuery.deleteOne({ _id: query._id });
                    res.send({ country: queryUpdated.otherCountry });
                }
                await helpers.sleep(3000);
            }
        })
    }
})



module.exports = app;