require('dotenv').config({ path: './.env' });

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running 🚀' });
});


// Start server directly
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// DB connection separate

