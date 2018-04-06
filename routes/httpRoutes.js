var models = require('../models');

var express = require('express');

var router = express.Router();

router.get('/*', (req, res, next) => {
    var id = req.session.userId;
    if (id) {
        models.User.findOne(
            { where: { id: id } }
        ).then(user => {
            req.userInfo = user;
            res.hbsData = {
                logged: true,
                displayName: user.displayName,
                thisPath: req.path,
            };
            next();
        });
    } else {
        res.hbsData = {
            logged: false,
            displayName: "guest",
            thisPath: req.path,
        };
        next();
    }
})

router.get('/', (req, res) => {
    res.render('index', res.hbsData);
});
router.get('/rescues', (req, res) => {
    res.render('rescues', res.hbsData);
});
router.get('/rescueDetails', (req, res) => {
    res.render('rescueDetails', res.hbsData);
});
router.get('/events', (req, res) => {
    res.render('events', res.hbsData);
});
router.get('/eventDetails', (req, res) => {
    res.render('eventDetails', res.hbsData);
});
router.get('/addEvent', (req, res) => {
    res.render('addEvent', res.hbsData);
});
router.get('/profile', (req, res) => {
    res.render('profile', res.hbsData);
});
router.get('/login', (req, res) => {
    res.render('login', res.hbsData);
});
router.get('/register', (req, res) => {
    if (req.session.userId) {
        res.redirect('/'); // logged in users can't register, DUH!
    } else if (req.session.oauthId) {
        // authenticated. create account and proceed to profile setup
        var firstName = "";
        var lastName = "";
        if (req.session.authType == 'google') {
            var name = (req.session.oauthProfile || {}).name || {};
            firstName = name.givenName || firstName;
            lastName = name.familyName || lastName;
        }

        // create user account first
        models.User.create({
            authType: req.session.authType,
            oauthId: req.session.oauthId,
            displayName: req.session.oauthDisplayName,
            bio: "",
            status: 'active',
            firstName: firstName,
            lastName: lastName,
            email: null,
        }).then(result => {
            req.session.userId = result.id;
            res.hbsData.displayName = req.session.oauthDisplayName;
            if (req.session.authType == 'google') {
                res.hbsData.firstName = req.session.oauthProfile.name.givenName || "";
                res.hbsData.lastName = req.session.oauthProfile.name.familyName || "";
            }
            res.render('register', res.hbsData);
        }).catch(err => {
            console.log(err);
        });
    } else {
        res.redirect('/login'); // User must oauth before creating an account here.

    }
});
router.get('/logout', (req, res) => {
    req.logout();
    delete req.session['token'];
    delete req.session['authType'];
    delete req.session['oauthId'];
    delete req.session['oauthDisplayName'];
    delete req.session['oauthProfile'];
    delete req.session['userId'];
    req.session.save(err => {
        res.redirect('/');
    });
});
router.get('/test', (req, res) => {
    res.hbsData.eventData = {
        name: "Event name",
        datestring: "11/11/11 11:11 AM",
        link: "http://website.com/thingymcstuffalot",
        addressLines: ['10 street lane', 'New York, NY 10108'],
        descriptionLines: [
            "This is totally an event at a place and you're reading the description.",
            "I just wanted to actually see some text on the page, kthxbie."
        ],
        descriptionText: "This is totally an event at a place and you're reading the description.\nI just wanted to actually see some text on the page, kthxbie."
    };
    res.render('test', res.hbsData);
});

function getUser(req) {
    var id = req.session.userId;
    if (!id) return Promise.resolve(null);
    return models.User.findOne({ where: { id: id } });
}

module.exports = router;