const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
        clientID: '46915514212-r1sb41g5ghf2vc2bi0paseiq94n74frj.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'https://dailycollege.testingfothink.my.id//auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Cari pengguna berdasarkan Google ID
            let user = await User.findOne({ googleId: profile.id });
    
            if (!user) {
                // Jika pengguna tidak ada, periksa apakah email sudah terdaftar
                user = await User.findOne({ email: profile.emails[0].value });
    
                if (user) {
                    // Jika email sudah ada, langsung login
                    user.googleId = profile.id; // Tambahkan Google ID ke pengguna yang sudah ada
                    await user.save();  // Simpan update pengguna
                } else {
                    // Jika pengguna tidak ditemukan, buat pengguna baru
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: null, // Tidak perlu password
                    });
    
                    await user.save();  // Simpan pengguna baru
                }
            }
    
            // Kirimkan pengguna yang ditemukan atau baru dibuat
            done(null, user);
    
        } catch (err) {
            done(err, null);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user._id);
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