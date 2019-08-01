const express = require('express');

const app = express();

app.use('/api/posts',(req, res, next) => {
    const posts = [
        {id: 'kenneth', 
        title: 'First server-side post',
        content: 'this is coming from the server'
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