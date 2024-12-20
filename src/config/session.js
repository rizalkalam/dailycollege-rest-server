const session = require('express-session');
const connectRedis = require('connect-redis'); // Menggunakan require untuk import
const redisClient = require('./redisClient'); // Menggunakan require untuk import redisClient

const RedisStore = connectRedis(session);

const sessionConfig = {
  store: new RedisStore({ client: redisClient }), // redisClient sudah berupa objek yang terhubung ke Redis
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
};

module.exports = sessionConfig;
