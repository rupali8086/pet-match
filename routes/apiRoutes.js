var models = require('../models');

// The routes specified in this file will be mounted at '/api'.
// For example, app.post('createUser') will be accessible at '/api/createUser'

// todo: use our models to make the magic happen

var express = require('express');
var router = express.Router();

router.use('/*', (req, res, next) => {
    var id = req.session.userId;
    if (id) {
        models.User.findOne(
            { where: { id: id } }
        ).then(user => {
            req.userInfo = user;
            next();
        });
    } else {
        next();
    }
})

router.post('/login', (req, res) => {
    res.status('501').end();
});
router.post('/createAccount', (req, res) => {
    res.status('501').end();
});
// Creates a new event listing
// Expects: {userId, date, address, city, state, zip, description, RSVP}
// Returns: 
//  {
//      status: "error" | "inserted",
//      error?: string,
//      value?: (inserted record),
//  }
router.post('/editInfo', (req, res) => {
    models.Event.create({
        UserId: req.session.userId,
        name: req.body.name,
        date: req.body.date,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        description: req.body.description,
        link: req.body.link,
    }).then(result => {
         console.log(result);
        res.json({
            status: 'inserted',
            value: result,
        });
    }).catch(e => {
        res.json({
            status: 'error',
            error: e.message || e.msg || e || "unknown error",
        });
    });
    // res.status('501').end();
});

// Modifies an existing even listing
// Expects: {date?, address?, city?, state?, zip?, description?, RSVP?}
// Returns: 
//  {
//      status: "error" | "updated" | "none",
//      error?: string,
//      affectedRows?: number
//  }
router.put('/editInfo/:id', (req, res) => {
    // update event
    
    models.Event.update({
        date: req.body.date,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        description: req.body.description,
        link: req.body.link,
    }, {
        where: {
            id: req.params.id, 
            UserId: req.session.userId,
    }}).then(result => {
        console.log(result);
        res.json({
            status: result[0] ? 'updated' : 'none',
            affectedRows: result[0],
        });
    }).catch(e => {
        res.json({
            status: 'error',
            error: e.message || e.msg || e || "unknown error",
        });
    });
});
// Removes and existing event entry by ID
// - Returns: 
//    {
//        status: "error" | "removed",
//        error?: string,
//    }
// - Todo: some kind of user or user token validation
router.delete('/editInfo/:id', (req, res) => {
    models.Event.destroy({
        where: {
            id: req.params.id,
            UserId: req.session.userId,
        }
    }).then(result => {
        console.log(result);
        if (result == 0) {
            res.json({ status: 'error', error: 'no match found' });
        } else {
            res.json({ status: 'removed' });
        }
    }).catch(e => {
        res.json({ status: 'error', error: 'no match found' });
    });
});
router.post('/profile', (req, res) => {
    res.status('501').end();
});

module.exports = router;