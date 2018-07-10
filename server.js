var express = require('express');
var app = express();
var path = require('path');
var flash = require('express-flash');

var bodyParser = require('body-parser');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var expressValidator = require("express-validator");
var keys = require('./keys');
var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;;
var port = process.env.PORT || 6008;
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json());
var publicPath = path.join(__dirname,'../public');
app.use('/uploads',express.static('uploads'));
app.use(express.json());

app.use(express.static(publicPath));
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
	resave: false,
	
	cookie:{maxAge:60*60*60*1000}

	}));





app.use(passport.initialize());

app.use(passport.session());
app.use(expressValidator());
app.use(flash());




app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.header("Access-Control-Allow-Origin", `http://${req.headers.host}`);
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Origin,Content-Type,   Authorization, x-id, Content-Length, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

	next();
  });
  passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret:keys.FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    res.status(200).json({
        accessToken : accessToken,
        refreshToken : refreshToken,
        profile : profile
    })
  }
));

app.get('/facebook',  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] }));
app.get('/facebook/redirect',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


app.listen(port,()=>{
   
    console.log(`Port Started on ${port}`);
})