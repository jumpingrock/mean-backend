const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const env = require("../../nodemon");

exports.createUser = (req, res, next) => {

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
            res.status(500).json({
                message: "Invalid authentication credentials!"
            });
        });
    });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}) //keyword findOne().. different from find()
    .then(user => {
        // console.log(user[0].password);
        if(!user){ //user not found
            return res.status(401).json({
                message: "Auth Failed Username or Password Incorrect!"
            })
        }
        fetchedUser = user;
        // console.log("userpassword req: " + req.body.password);
        // console.log("userpassword: " + fetchedUser[0].password);
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        // console.log(result);
        if(!result){ //password wrong
            return res.status(401).json({
                message: "Auth Failed Username or Password Incorrect!"
            })
        }
        //console.log(fetchedUser);
        const jwttoken = jwt.sign(
            {email: fetchedUser.email, userId: fetchedUser._id}, 
            process.env.JWT_KEY, 
            { expiresIn: "1h" }
        );
        // console.log("JWT Token");
        // console.log(jwttoken)
        res.status(200).json({
            token: jwttoken,
            expiresIn: 3600, //expire duration in seconds
            userId: fetchedUser._id
        });
    }).catch(err => {
        return res.status(401).json({
                message: "Invalid authentication credentials!"
        })
    });
}