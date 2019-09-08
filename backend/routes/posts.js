const express = require("express");
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        callback(error, 'backend/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    // const post = req.body;
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({ // Post model is from router.js where it is hooked up to mongoose
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save()
    .then(postCreated => {
        // console.log('helloooooooooooooooooooooooooooooooooooo');
        // console.log(postCreated);
        res.status(201).json({
            message: 'Post added Successfully!',
            post: {
                ...postCreated,
                id: postCreated._id,
                imagePath: postCreated.imagePath
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });
})

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    // console.log("break");
    // console.log(req.file);
    // console.log("break");
    let imagePath = req.body.imagePath;
    if (req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId

    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then( result => {
        console.log(result);
        if (result.nModified > 0) {
            res.status(200).json({message: 'Update successful!'});
        }else {
            res.status(401).json({message: 'Not Authorized to update post!'});
        }
    })
    .catch(error => {//technical error like connection error
        res.status(500).json({
            message: "Coulden't update post!"
        });
    });
});

router.get('',(req, res, next) => {
    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    // console.log(pageSize, currentPage)
    const postQuery = Post.find(); //will only exercute when you call method with .then()
    let fetchedPosts;
    if (pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    // Post.find().then(documents => { // original query
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => { //new query with page property
            
            res.status(200).json({ // need to send response within async function
                message: 'Post fetched successfully!',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({message: "Fetching post failed!"})
        });
});

router.get('/:id',(req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        }else {
            res.status(404).json({message: 'Post not found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed"
        })
    });
});


router.delete("/:id", checkAuth, (req, res, next) => { 
    console.log(req.params.id + " Deleted");
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
        console.log(result);
        if (result.n > 0) {
            res.status(200).json({message: 'Delete successful!'});
        }else {
            res.status(401).json({message: 'Not authorized to delete post!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed"
        })
    });

    
})
module.exports = router;