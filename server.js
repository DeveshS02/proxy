const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Define allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

// Configure CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors(corsOptions));

// List of endpoints from environment variable
const endpoints = process.env.ENDPOINTS.split(',');

// Target URL from environment variable
const targetUrl = process.env.TARGET_URL;

// Configure the proxy for each endpoint
endpoints.forEach(endpoint => {
    app.use(`/water/${endpoint}`, createProxyMiddleware({
        target: `${targetUrl}/${endpoint}`,
        changeOrigin: true,
    }));    
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
