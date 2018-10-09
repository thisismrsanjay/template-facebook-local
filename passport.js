const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const FacebookStrategy = require('passport-facebook').Strategy;
const config =require('./config');
const GoogleStrategy = require('passport-google-oauth20').Strategy; 

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-login',new LocalStrategy({
    usernameField:'email',

},(email,password,done)=>{
    User.findOne({email:email},(err,user)=>{
        if(err) return done(err);
        if(!user){
            return done(null,false,{
                message:'invalid email'
            })
        }
        bcrypt.compare(password,user.password,(err,isMatch)=>{
            if(err)throw err;
            if(isMatch){
                return done(null,user);
            }else{
                return done(null,false,{
                    message:'invalid password or email'
                })
            }
        })
    })
}))

passport.use(new FacebookStrategy(config.facebook,(req,token,refreshToken,profile,done)=>{
    User.findOne({'facebook':profile.id},(err,user)=>{
        if(err)return done(err);

        if(user){
            return done(null,user);
        }else{
            User.findOne({email:profile.emails[0].value},(err,user)=>{
                if(user){
                    user.facebook= profile.id;
                    return user.save((err)=>{
                        if(err)return done(null,false<{
                            message:'error in saving id'
                        })
                        return done(null,user);
                    })
                }

                var user = new User();
                user.email = profile.emails[0].value;
                user.profile.name = profile.displayName;
                user.facebook = profile.id;
                user.profile.picture = "https://graph.facebook.com/"+profile.id+"/picture?type=large&width=50&height=50"
                user.save((err,user)=>{
                    if(err){
                        console.log(err);
                        return done(null,false,{
                            message:'error in registration'
                        })
                    }
                    return done(null,user);
                })


            })
        }
    })
}))

passport.use(new GoogleStrategy({
    clientID:config.google.googleClientID,
    clientSecret:config.google.googleClientSecret,
    callbackURL:config.google.callbackURL,
    proxy:true
},(accessToken,refreshToken,profile,done)=>{
    
    //console.log(profile);
    User.findOne({'google':profile.id},(err,user)=>{
        if(err)return done(err);
        
        if(user){
            return done(null,user);
        }else{
            User.findOne({email:profile.emails[0].value},(err,user)=>{
                if(user){
                    user.google= profile.id;
                    return user.save((err)=>{
                        if(err)return done(null,false<{
                            message:'error in saving id'
                        })
                        return done(null,user);
                    })
                }
                const image = profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'));

                var user = new User();
                user.email = profile.emails[0].value;
                user.profile.name = profile.name.givenName+' '+profile.name.familyName;
                user.google = profile.id;
                user.profile.picture = image;
                //console.log(user);
                user.save((err,user)=>{
                    if(err){
                        console.log(err);
                        return done(null,false,{
                            message:'error in registration'
                        })
                    }
                    return done(null,user);
                })


            })
        }
    })
    
    

}))