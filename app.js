const path = require('path');
const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const expressValidator = require('express-validator');
const passport  = require('passport');
const session =  require('express-session');
//just requiring it passes it to middeleware idkh
require('./passport');
const config = require('./config');


const mongoose = require('mongoose');
mongoose.connect(config.database,{ useCreateIndex: true,useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log('database connected'); 
});


app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
 }))
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})


const port =3000;

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.locals.errors = null;
app.locals.title = null;

app.use(expressValidator());


const index = require('./routes/index');
app.use('/',index);






server.listen(port,()=>{
    console.log('server started at 3000')
})