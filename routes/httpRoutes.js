var models = require('../models');
var express = require('express');
var formatDate = require('../utility/formatDate');

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
    models.Event.findAll()
        .then(results => {
            res.hbsData.events =
                results.map(result => getEventHbsData((req.userInfo || {}).id, result));
            res.render('events', res.hbsData);
        }).catch(e => {
        });
});
router.get('/eventDetails', (req, res) => { // ?id=_
    if (!req.userInfo) {
        res.render
    }


    var id = req.query.id || 0;
    models.Event.findOne({ where: { id: id } })
        .then(result => {
            // var event = result || { description: 'The event was not found.' };
            if (result) {
                res.hbsData.event = getEventHbsData((req.userInfo || {}).id, result);
            } else {
                res.hbsData.event = { description: 'The event was not found.' };
            }
            // res.hbsData.event = getEventHbsData((req.userInfo || {}).id, event);
            res.render('eventDetails', res.hbsData);
        }).catch(e => {
            console.log(e);
            res.status(500).end();
        });
});
function getEventHbsData(viewingUserId, eventModelInst) {
    return {
        id: eventModelInst.id,
        owner: viewingUserId == eventModelInst.UserId,
        name: eventModelInst.name || '',
        datestring: formatDate(eventModelInst.date),
        date: getDatetimeInputString(eventModelInst.date),
        address1: eventModelInst.address1 || '',
        address2: eventModelInst.address2 || '',
        city: eventModelInst.city || '',
        state: eventModelInst.state || '',
        zip: eventModelInst.zip || '',
        description: eventModelInst.description || '',
        descriptionLines: (eventModelInst.description || '').split('\n'),
        link: eventModelInst.link || '',
    };
}
function getDatetimeInputString(dateObject) {
    if (dateObject.toJSON) {
        return dateObject.toJSON().slice(0, 19);
    } else return '';
}
router.get('/addEvent', (req, res) => {
    res.hbsData.now = new Date().toJSON().slice(0, 19);

    res.render('addEvent', res.hbsData);
});
router.get('/profile', (req, res) => {
    if (req.userInfo) {
        res.hbsData.userId = req.session.userId || 0;
        res.hbsData.user = {
            firstName: req.userInfo.firstName,
            lastName: req.userInfo.lastName,
            displayName: req.userInfo.displayName,
            bio: req.userInfo.bio,
            email: req.userInfo.email,
            status: req.userInfo.status,
        };

        models.Event.findAll({ where: { UserId: req.session.userId || 0 } })
            .then(events => {

                res.hbsData.events = events.map(e => ({ name: e.name, id: e.id }));
                res.render('profile', res.hbsData);
            }).catch(e => {
                console.log(e);
                res.status(500).end();
            });
    } else {
        res.render('profile', res.hbsData);
    }
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