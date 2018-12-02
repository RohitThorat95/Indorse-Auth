const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');

//send verificaiton email
let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.VERIFICATION_EMAIL,
        pass: process.env.VERIFICATION_PASSWORD
    }
});

let rand, mailOptions, host, link;

//signup user
router.post('/register', [check('email').isEmail(), check('password').isAlphanumeric().isLength({ min: 5 })], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    //check if email exists in the database
    let userFound = await User.find({ email: req.body.email }).exec();

    if (userFound.length) {
        return res.json('Email already exists in the database, please try with different email.');
    } else {
        User.createUser(newUser, async (err, user) => {
            if (err) {
                return res.json('Some error occured. Cannot save.');
            } else {
                //configure node mailer
                rand = Math.floor((Math.random() * 100) + 54);
                host = req.get('host');
                link = "http://" + req.get('host') + "/verify?id=" + rand;
                mailOptions = {
                    to: req.body.email,
                    subject: "Please confirm your Email account",
                    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                }

                smtpTransport.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Message sent");
                    }
                });
                return res.json(user);
            }
        });
    }
});

router.get('/verify', async (req, res) => {
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            console.log("email is verified");
            await User.findOneAndUpdate({ email: mailOptions.to }, { $set: { isVerified: true } }).exec();
            return res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
        }
        else {
            console.log("email is not verified");
            return res.end("<h1>Bad Request</h1>");
        }
    }
});

router.post('/login', [check('email').isEmail(), check('password').isAlphanumeric().isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let email = req.body.email;
    let password = req.body.password

    //check if the user is verified or nor
    let userFound = await User.find({ email: email }).exec();

    if (!userFound) {
        res.json('Please register first.');
    } else {
        if (userFound[0].isVerified) {
            User.comparePassword(password, userFound[0].password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                } else {
                    if (isMatch) {
                        res.json('You are logged in');
                    } else {
                        res.json('Wrong password')
                    }
                }
            });
        } else {
            res.json('Please verify you email beforw login.');
        }
    }
})

module.exports = router;