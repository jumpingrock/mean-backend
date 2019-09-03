const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();


router.post('/signup', (req, res, next) => {

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

    let fetchedUser;
    User.findOne({email: req.body.email}) //keyword findOne().. different from find()
    .then(user => {
        // console.log(user[0].password);
        if(!user){
            return res.status(401).json({
                message: "Auth Failed 1"
            })
        }
        fetchedUser = user;
        // console.log("userpassword req: " + req.body.password);
        // console.log("userpassword: " + fetchedUser[0].password);
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        // console.log(result);
        if(!result){
            return res.status(401).json({
                message: "Auth Failed 2"
            })
        }
        const jwttoken = jwt.sign(
            {email: fetchedUser.email, userId: fetchedUser._Id}, 
            "secret_this_should_be_longer", 
            { expiresIn: "1h" }
        );
        console.log(jwttoken)
        res.status(200).json({
            token: jwttoken,
            expiresIn: 3600 //expire duration in seconds
        });
    }).catch(err => {
        return res.status(401).json({
                message: "Auth Failed 3"
        })
    });
})

module.exports = router;
