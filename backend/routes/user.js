const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();


router.post('/signup', (req, res, next) => {
    console.log("in user post route.............");
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                result: result
            });
        }).catch(err => {
            error: err
        });
    });
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(401).json({
                message: "Auth Failed"
            })
        }
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if(!result){
            return res.status(401).json({
                message: "Auth Failed"
            })
        }
        const token = jwt.sign({
            email: user.email, userId: user._Id}, 
            'secret_this_should_be_longer', 
            {expiresIn: '1h'
        });
    }).catch(err => {
        return res.status(401).json({
                message: "Auth Failed"
        })
    })
})

module.exports = router;
