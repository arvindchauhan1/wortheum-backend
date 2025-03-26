const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // For generating unique strings

// Local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = crypto.randomBytes(8).toString('hex'); // Generates a unique ID
        cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
    }
});

module.exports = storage;
