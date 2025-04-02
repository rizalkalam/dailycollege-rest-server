const session = require('express-session');
const connectRedis = require('connect-redis'); // Menggunakan require untuk import
const redisClient = require('./redisClient'); // Menggunakan require untuk import redisClient

const RedisStore = connectRedis(session);

const sessionConfig = {
  store: new RedisStore({ client: redisClient }), // redisClient sudah berupa objek yang terhubung ke Redis
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        httpOnly: true,
        maxAge: 5 * 60 * 1000,  // session expires after 5 minutes
        domain: '.testingfothink.my.id'
    }
};

module.exports = sessionConfig;
