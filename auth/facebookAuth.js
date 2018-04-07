const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = (passport) => {
    passport.serializeUser((user,done) => {
        done(null, user);
    });

    passport.deserializeUser((user,done) => {
        done(null,user);
    });

    passport.use(new FacebookStrategy ({
        clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });

    }));
};