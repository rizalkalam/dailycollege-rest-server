const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
        clientID: '46915514212-r1sb41g5ghf2vc2bi0paseiq94n74frj.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'https://dailycollege.testingfothink.my.id/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: null,
                });
                await user.save();
                user.isNew = true; // Mark as new user
            }
            done(null, user); // Pass user object to callback
        } catch (err) {
            done(err, null);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;