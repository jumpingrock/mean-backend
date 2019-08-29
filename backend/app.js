const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require("./routes/posts");

const app = express();
//mongo "mongodb+srv://cluster0-qs02p.mongodb.net/node-angular" --username kenneth
//Yz9CupOcdi2NN0P3
mongoose.connect('mongodb+srv://kenneth:Yz9CupOcdi2NN0P3@cluster0-qs02p.mongodb.net/node-angular?retryWrites=true&w=majority')
    .then(() => { //async db connection using mongoose app
        console.log('Connected to mongoDB!');
    })
    .catch(() => { //error log if db connection fail
        console.log('Connection failed!!');
    })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {// cors allow for sending of url msg using different localhost
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Headers", "*Origin, X-Request-Width, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
})
app.use('/api/posts', postsRoutes);


module.exports = app;