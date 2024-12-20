const swaggerJSDoc = require('swagger-jsdoc');

// Konfigurasi Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation', // Nama API
        version: '1.0.0',           // Versi API
        description: 'API documentation for the Express.js application',
    },
    servers: [
        {
            url: 'http://localhost:3000', // Base URL API untuk development
            description: 'Localeee Server', // Deskripsi server development
        },
        {
            url: 'https://dailycollege.testingfothink.my.id', // Base URL API untuk staging
            description: 'Devdevdev Server', // Deskripsi server staging
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // Path ke file routes
};

const swaggerDocument = swaggerJSDoc(options);

module.exports = swaggerDocument;
