const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

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

app.post('/api/posts', (req, res, next) => {
    // const post = req.body;
    
    const post = new Post({ // Post model is from app.js where it is hooked up to mongoose
        title: req.body.title,
        content: req.body.content
    });
    // console.log(res);
    post.save().then(postCreated => {
        console.log(postCreated);
        res.status(201).json({
            message: 'Post added Successfully!',
            postId: postCreated._id
        }); //this will push data into mongodb atlas via mongoose 
                //collection will be named after your pural form of your model name
    });
})

app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then( result => {
        console.log(result);
        res.status(200).json({message: 'Update successful!'});
    });
});

app.get('/api/posts',(req, res, next) => {
    // const posts = [
    //     {id: 'kenneth', 
    //     title: 'First server-side post',
    //     content: 'This is coming from the server'
    //     },
    //     {id: 'keen', 
    //     title: 'Second server-side post',
    //     content: 'This is also coming from the server!!!'
    //     }
    // ];
    Post.find().then(documents => {
            // console.log(documents);
            const posts = documents

            res.status(200).json({ // need to send response within async function
                message: 'Post fetched successfully!',
                posts: posts
            });
        });
});

app.get('/api/posts/:id',(req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        }else {
            res.status(404).json({message: 'Post not found!'});
        }
    });
});


app.delete("/api/posts/:id", (req, res, next) => { 
    console.log(req.params.id + " Deleted");
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "Post deleted!"});
    })

    
})

module.exports = app;