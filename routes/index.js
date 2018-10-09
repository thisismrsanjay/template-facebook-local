const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config');
const transporter  = nodemailer.createTransport(config.mailer);
const User = require('../models/user');
const passport = require('passport');



const bcrypt = require('bcryptjs');
//const passport = require('passport');

router.get('/',(req,res,next)=>{
    res.render('index',{title:'Home'})
})

router.get('/about',(req,res,next)=>{
    res.render('about',{title:'About'})
})
router.get('/contact',(req,res,next)=>{
    res.render('contact',{title:'Contact',
    name:'',
    message:'',
    email:''
})
})
router.post('/contact',(req,res,next)=>{
    

    req.checkBody('name','Fill  your name').notEmpty();
    req.checkBody('email','Invalid Email').isEmail();
    req.checkBody('message','Empty Message').notEmpty();
    let errors = req.validationErrors();

    if(errors){
        res.render('contact',{
            title:'Contact', 
            name:req.body.name,
            email:req.body.email,
            message:req.body.message,
            errors:errors
        })
    }else{
        let mail={
            from:'iTutor',
            to:'thisismrsanjay@gmail.com',
            subject:'Message from iTutor',
            text:req.body.message
        }
        transporter.sendMail(mail,(error,info)=>{
            if(error)
                return console.log(error);
            res.render('thanks',{title:'Thank You'});
        })

        
    }
})

router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}))
router.get('/auth/facebook/call',passport.authenticate('facebook',{
    successRedirect:'/',
    failureRedirect:'/'
}))

router.get('/auth/google/call',
  passport.authenticate('google', {
    successRedirect:'/',
    failureRedirect: '/login'
}));

router.get('/auth/google', passport.authenticate('google',
  { scope: ['profile', 'email'] }
));

router.get('/login',(req,res,next)=>{
    res.render('login',{title:'Login'})
})

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
})

router.get('/register',(req,res,next)=>{
    res.render('register',{title:'Register'})
})
router.post('/register',(req,res,next)=>{
    let user = new User();
    //no server side validation

    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profile.picture = user.gravatar();

    User.find({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        else {
            if (data.length >= 1) {
                
                 res.render('login',{
                    errors:[{msg:'Email already exists '}],
                    title:'login'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({ error: err, message: 'hashing failed' });
                    } else {
                        //cool
                        user.password=hash;

                        user.save((err, data) => {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                    res.redirect('/login');
                            }
                        })
                    }
                })
            }
        }
    })




})


module.exports = router;