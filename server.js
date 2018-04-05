//// Modules /////////////////////////////////////////
var express = require('express');
var dotenv = require('dotenv');
var handlebars = require('express-handlebars');
var passport = require('passport')
var httpRoutes = require('./routes/httpRoutes');
var database = require('./models');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

//// Configure Application ///////////////////////////

var PORT = process.env.PORT || 8080;
var app = express();

var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');


var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// from session file store

 
app.use(session({
    secret: 'keyboard cat',
    resave: true, saveUninitialized:true
}));

// For Passport
// app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

// Routing
app.use(express.static('public'));
app.use(httpRoutes);

//// Start Server ////////////////////////////////////

database.sequelize.sync({force: true}).then(function () {
    console.log("Database connected.")
}).catch(err => {
    console.log("Failed to connect to database.", err);
});
var server = app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});    
