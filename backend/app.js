const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
//mongo "mongodb+srv://cluster0-qs02p.mongodb.net/test" --username kenneth
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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

app.post('/api/posts', (req, res, next) => {
    // const post = req.body;
    
    const post = new Post({ // Post model is from app.js where it is hooked up to mongoose
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    post.save(); //this will push data into mongodb atlas via mongoose 
                //collection will be named after your pural form of your model name
    res.status(201).json({
        message: 'Post added Successfully!'
    });
})

app.get('/api/posts',(req, res, next) => {
    const posts = [
        {id: 'kenneth', 
        title: 'First server-side post',
        content: 'This is coming from the server'
        },
        {id: 'keen', 
        title: 'Second server-side post',
        content: 'This is also coming from the server!!!'
        }
    ];
    res.status(200).json({
        message: 'Post fetched successfully!',
        posts: posts
    });
});

module.exports = app;