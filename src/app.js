const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const forgotPassword = require('./routes/forgotPasswordRoutes')
const taskRoutes = require('./routes/taskRoutes')
const dayRoutes = require('./routes/dayRoutes'); 
const courseScheduleRoutes = require('./routes/courseScheduleRoutes');
const colorRoutes = require('./routes/colorRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const financeRoutes = require('./routes/financeRoutes');
const freshRoutes = require('./routes/freshRoutes')
const session = require('express-session'); // Pastikan 'express-session' diimpor
const dotenv = require('dotenv');
const passport = require('./config/passport');
const sessionConfig = require('./config/session');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Mengimpor cors
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        // Izinkan semua origin atau sesuaikan dengan kebutuhan
        const allowedOrigins = [
          'http://localhost:3000',
          'https://dailycollege.testingfothink.my.id',
          'https://dailycollege.vercel.app'
        ];
        
        // Untuk development: izinkan semua origin (termasuk undefined/Postman)
        if (process.env.NODE_ENV === 'development' || !origin) {
          return callback(null, true);
        }
    
        // Untuk production: cek daftar origin yang diizinkan
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Origin tidak diizinkan oleh kebijakan CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
      credentials: true,
      exposedHeaders: ['set-cookie'],
      optionsSuccessStatus: 200 // Untuk browser lama
};

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://dailycollege.testingfothink.my.id',
        'https://dailycollege.vercel.app'
      ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware untuk body parser (untuk menerima data POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware untuk mem-parsing JSON
app.use(bodyParser.json()); // Untuk parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // Untuk parsing application/x-www-form-urlencoded

app.use(cookieParser());

// Middleware
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());


// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,  // Untuk menampilkan Explorer jika diperlukan
}));


// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/forgot_password', forgotPassword);
app.use('/tasks', taskRoutes);
app.use('/days', dayRoutes);
app.use('/course-schedule', courseScheduleRoutes);
app.use('/colors', colorRoutes);
app.use('/calendar', calendarRoutes);
app.use('/finance', financeRoutes);
app.use('/fresh', freshRoutes);

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
