const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // For security
require('dotenv').config();

const app = express();

// --- Security and CORS ---
// Use Helmet to set secure HTTP headers
app.use(helmet());

// More flexible CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:5174').split(',');

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Body Parsing ---
app.use(express.json());

// --- Routes ---
// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'SkillBridge API is running!' });
});

// Import routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/users', require('./routes/users.js'));

// --- Start Server after DB connection ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    });

// --- Centralized Error Handling ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});