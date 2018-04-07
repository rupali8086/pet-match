//// Modules /////////////////////////////////////////
var express = require('express');
var fs = require('fs');
var rimraf = require('rimraf');
var dotenv = require('dotenv').config();
var path = require('path');
var handlebars = require('express-handlebars');
var httpRoutes = require('./routes/httpRoutes');
var apiRoutes = require('./routes/apiRoutes');
var database = require('./models');

var passport = require('passport');
var googleAuth = require('./auth/googleAuth');
var facebookAuth = require('./auth/facebookAuth');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

//// Configure Application ///////////////////////////

// For dev, our DB is wiped each time the app launches. We
// don't want old sessions referencing non-existant records.
try {
    rimraf.sync(path.join(__dirname, 'sessions'));
} catch (e) {
    // HOPE NOTHING GOES WRONG!
}

var PORT = process.env.PORT || 8080;
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// from session file store

var sessionStore = new FileStore();
// sessionStore.clear();
app.use(session({
    store: sessionStore,
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// // For Passport
// // app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret

// app.use(passport.initialize());

// app.use(passport.session()); // persistent login sessions

// Routing
app.set('trust proxy', true);

googleAuth.initStrategy(passport);
app.use(passport.initialize());
app.use(googleAuth.router);

// app.get('/auth/google', function (a, b, next) {
//     next();
// });

// app.get('/auth/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: 'http://localhost:8080/',
//     }),
//     (req, res) => { 
//         req.session.token = req.user.token;
//         req.session.authType = 'google';
//         req.session.oauthId = req.user.profile.id;
//         req.session.oauthDisplayName = req.user.profile.displayName;
//         req.session.oauthProfile = req.user.profile;
//         req.session.save();
        
//         database.User.findOne({
//             where: {
//                 authType: req.session.authType,
//                 oauthId: req.session.oauthId
//             }
//         }).then(data => {
//             if (data) {
//                 // User is already registered.
//                 req.session.userId = data.id;
//                 // Redirect to saved redirect url (or landing page if not set)
//                 if (req.session.redirectUrl) {
//                     res.redirect(req.session.redirectUrl);
//                 } else {
//                     res.redirect('/');
//                 }
//             } else {
//                 // User is NOT registered.
//                 res.redirect('/register');
//             }
//         });
//     }
// );






// facebook
facebookAuth(passport);
app.use(passport.initialize());

app.get('/auth/facebookAuth', function (a, b, next) {
    next();
});

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: 'http://localhost:8080/',
    }),
    (req, res) => { 
        req.session.token = req.user.token;
        req.session.authType = 'facebook';
        req.session.oauthId = req.user.profile.id;
        req.session.oauthDisplayName = req.user.profile.displayName;
        req.session.oauthProfile = req.user.profile;

        database.User.findOne({
            where: {
                authType: req.session.authType,
                oauthId: req.session.oauthId
            }
        }).then(data => {
            if (data) {
                // User is already registered.
                req.session.userId = data.id;
                // Redirect to saved redirect url (or landing page if not set)
                if (req.session.redirectUrl) {
                    res.redirect(req.session.redirectUrl);
                } else {
                    res.redirect('/');
                }
            } else {
                // User is NOT registered.
                res.redirect('/register');
            }
        });
    }
);

app.get('/auth/facebook/auth', function (req, res, next) {
    if (!req.user) { // Not already logged in, probably okay to try to hit the oauth provider
        return next();
    }
    res.redirect('/'); // Already logged in, send them where I want them after the callback anyway.
}, passport.authenticate('facebook', 
    { scope : ['public_profile', 'email'] }
    ));




app.use(express.static('public'));
app.use(httpRoutes);
app.use('/api', apiRoutes);

//// Start Server ////////////////////////////////////

database.sequelize.sync({ force: true }).then(function () {
    console.log("Database connected.")
    // for testing purposes
    database.User.create({ firstname: "tom", lastname: "my", username: "tommy", about: "sup", email: "a@b.com", password: "dog", last_login: Date(), status: 'active' }).then(r => console.log(r)).catch(e => console.log(e));

}).catch(err => {
    console.log("Failed to connect to database.", err);
});
var server = app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});    
