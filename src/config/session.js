const session = require('express-session');
const connectRedis = require('connect-redis'); // Menggunakan require untuk import
const redisClient = require('./redisClient'); // Menggunakan require untuk import redisClient

const RedisStore = connectRedis(session);

const sessionConfig = {
  store: new RedisStore({ client: redisClient }), // redisClient sudah berupa objek yang terhubung ke Redis
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { 
        secure: false, // set ke true jika menggunakan https
        httpOnly: true,
        maxAge: 5 * 60 * 1000  // session expires after 5 minutes
    }
};

module.exports = sessionConfig;
