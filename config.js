module.exports={
    mailer:{
        service:'Gmail',
        auth:{
            user:'',
            pass:'',
        }
    },
    database : 'mongodb://<username>:<dbpass>@ds121183.mlab.com:21183/itutor',
    secret:'glorious',
    facebook:{
        clientID:'',
        clientSecret:'',
        callbackURL:'http://localhost:3000/auth/facebook/call',
        profileFields:['id','displayName','email']
    },
    google:{
        googleClientID:'',
        googleClientSecret:'',
        callbackURL:'/auth/google/call'
    }
    
}

