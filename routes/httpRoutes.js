var express = require('express');

var router = express.Router();

var User = require('../models');
module.exports = function(app, passport){
	router.get('/', function(req, res){

		// html file name  
		res.render('index.html');
	});


	// for local login (if in case )
	/*router.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	router.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	router.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});*/

	//  login with facebook
	router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	router.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));

	// login with google+
	router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	router.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}

module.exports = router;