module.exports={
    mailer:{
        service:'Gmail',
        auth:{
            user:'tutorsfactory@gmail.com',
            pass:'Isuyash210@123',
        }
    },
    database : 'mongodb://sanjay:sanjay123@ds121183.mlab.com:21183/itutor',
    secret:'glorious',
    facebook:{
        clientID:'255732381795481',
        clientSecret:'9483f0e90a568e7b46b5dea15d752b68',
        callbackURL:'http://localhost:3000/auth/facebook/call',
        profileFields:['id','displayName','email']
    }
}
