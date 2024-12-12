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

// welcome page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hello World</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    height: 100vh;
                    margin: 0;
                    font-family: 'Arial', sans-serif;
                    background: linear-gradient(to right, #ff7e5f, #feb47b);
                    color: white;
                    text-align: center;
                }
                h1 {
                    font-size: 3rem;
                    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                    margin-bottom: 20px;
                }
                p {
                    font-size: 1.2rem;
                    font-weight: 300;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
                    margin-bottom: 20px;
                }
                a {
                    font-size: 1.1rem;
                    color: #fff;
                    text-decoration: none;
                    padding: 10px 20px;
                    background-color: #333;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.3s;
                }
                a:hover {
                    background-color: #555;
                }
            </style>
        </head>
        <body>
            <h1>Hello, World!</h1>
            <p>Welcome to dailycollege development. Stay tuned for more updates!</p>
            <a href="/docs" target="_blank">Check API Documentation</a>
        </body>
        </html>
    `);
});

module.exports = app;
