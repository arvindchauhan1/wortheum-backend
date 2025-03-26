require('dotenv').config({ path: './.env' });

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

// importing routes
const routes = require('./routes');
// global error handler
const errorHandler = require('./middlewares/error');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// static upload folder
app.use('/uploads', express.static('public/uploads'));



// DB
require('./config/db');

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running 🚀, brrrrr............🏃‍♂️‍➡️' });
});
app.use("/api/v1", routes);

// After all your routes:
// Global Error Handler (should always be after routes)
app.use(errorHandler);

// Start server directly
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// DB connection separate

