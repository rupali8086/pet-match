module.exports = {
  facebookAuth: {
    clientID: process.env. FACEBOOK_OAUTH_CLIENT_ID ,
    clientSecret: process.env. FACEBOOK_OAUTH_CLIENT_SECRET ,
    callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK
  },
   
  googleAuth: {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK
  },
  
  twitterAuth: {
  	clientID: process.env.TWITTER_CONSUMER_KEY,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_OAUTH_CALLBACK

  }
};
