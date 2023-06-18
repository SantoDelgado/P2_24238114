const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const emails = [process.env.ADMIN_EMAIL_GOOGLE];

passport.use(new GoogleStrategy({
    clientID: "140550704929-4a4rnuvdhac78d59fb566qp9luubs74e.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://santodelgado.onrender.com/auth/google/callback"
  },function(accessToken, refreshToken, profile, cb) {
    const response = emails.includes(profile.emails[0].value);
    if(response){
        done(null, profile);
    } else {
        done(null, false);
    }
}));