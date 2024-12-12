const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session'); // Pastikan 'express-session' diimpor
const dotenv = require('dotenv');
const passport = require('./config/passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');


dotenv.config();
const app = express();


app.use(express.json());

// Middleware
app.use(session({ secret: 'wfowuef9uqr09wuuru39u3', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);

module.exports = app;
