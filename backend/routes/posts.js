const express = require("express");
const multer = require('multer');
const Post = require('../models/post');
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        // console.log('lalalalalalalalalalalalala');
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        callback(error, 'backend/images');
    },
    filename: (req, file, callback) => {
        // console.log('lalalalalalalalalalalalala!!!!!!!!!!!!!!!');
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('',multer({storage: storage}).single("image"), (req, res, next) => {
    // const post = req.body;
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({ // Post model is from router.js where it is hooked up to mongoose
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    // console.log(res);
    post.save().then(postCreated => {
        console.log('helloooooooooooooooooooooooooooooooooooo');
        console.log(postCreated);
        res.status(201).json({
            message: 'Post added Successfully!',
            post: {
                ...postCreated,
                id: postCreated._id,
                imagePath: postCreated.imagePath
            }
            
        }); //this will push data into mongodb atlas via mongoose 
        // console.log(res);      //collection will be named after your pural form of your model name
    });
})

router.put("/:id", (req, res, next) => {
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

router.get('',(req, res, next) => {
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

router.get('/:id',(req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        }else {
            res.status(404).json({message: 'Post not found!'});
        }
    });
});


router.delete("/:id", (req, res, next) => { 
    console.log(req.params.id + " Deleted");
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "Post deleted!"});
    })

    
})
module.exports = router;