// const express = require('express');
// var TwitterStrategy  = require('passport-twitter').Strategy;
// var router = express.Router();
// var passportInstance;
// var models = require('../models');


// module.exports = {
//     router: router,
//     initStrategy: (passport) => {
//         passportInstance = passport;

//         passport.serializeUser((user, done) => {
//             done(null, user);
//         });

//         passport.deserializeUser((user, done) => {
//             done(null, user);
//         });

//         passport.use(new TwitterStrategy({
//             clientID: process.env.TWITTER_CONSUMER_KEY,
//             clientSecret: process.env.TWITTER_CONSUMER_SECRET,
//             callbackURL: process.env.TWITTER_OAUTH_CALLBACK,
//         },
//             (token, refreshToken, profile, done) => {
//                 return done(null, {
//                     profile: profile,
//                     token: token
//                 });
//             }));



//         router.get('/auth/twitter', function (a, b, next) {
//             next();
//         });

//         router.get('/auth/twitter/callback',
//             passportInstance.authenticate('twitter', {
//                 failureRedirect: 'http://localhost:8080/',
//             }),
//             (req, res) => {
//                 req.session.token = req.user.token;
//                 req.session.authType = 'twitter';
//                 req.session.oauthId = req.user.profile.id;
//                 req.session.oauthDisplayName = req.user.profile.displayName;
//                 req.session.oauthProfile = req.user.profile;

//                 models.User.findOne({
//                     where: {
//                         authType: req.session.authType,
//                         oauthId: req.session.oauthId
//                     }
//                 }).then(data => {
//                     if (data) {
//                         // User is already registered.
//                         req.session.userId = data.id;
//                         // Redirect to saved redirect url (or landing page if not set)
//                         if (req.session.redirectUrl) {
//                             req.session.save((err => {
//                                 res.redirect(req.session.redirectUrl);
//                             }));
//                         } else {
//                             req.session.save((err => {
//                                 res.redirect(req.session.afterLogin || '/');
//                             }));
//                         }
//                     } else {
//                         // User is NOT registered.
//                         var firstName = "";
//                         var lastName = "";
//                         if (req.session.authType == 'twitter') {
//                             var name = (req.session.oauthProfile || {}).name || {};
//                             firstName = name.givenName || firstName;
//                             lastName = name.familyName || lastName;
//                         }

//                         // create user account first
//                         models.User.create({
//                             authType: req.session.authType,
//                             oauthId: req.session.oauthId,
//                             displayName: req.session.oauthDisplayName,
//                             bio: "",
//                             status: 'active',
//                             firstName: firstName,
//                             lastName: lastName,
//                             email: null,
//                         }).then(newData => {
//                             req.session.userId = newData.id;
//                             req.session.save((err) => {
//                                 res.redirect(req.session.afterLogin || '/');
//                             })
//                         }).catch(e => {
//                             res.status(500).end();
//                         });
//                     }
//                 }).catch(e => {
//                     res.status(500).end();
//                 });
//             }
//         );

//         router.get('/auth/twitter/auth', function (req, res, next) {
//             // redirect after login will be specified via query string, e.g. http://qwert.heroku.com/auth/google/auth?then=
//             if (req.query.then) {
//                 req.session.afterLogin = req.query.then;
//             }

//             req.session.save(() => {
//                 if (!req.user) { // Not already logged in, probably okay to try to hit the oauth provider
//                     return next();
//                 }
//                 res.redirect(req.session.afterLogin || '/'); // Already logged in, send them where I want them after the callback anyway.
//             })
//         }, passport.authenticate('twitter'));

//     }
// };