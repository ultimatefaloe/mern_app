const multer = require('multer');
const { v1: uuidv1 } = require('uuid');
// const fs = require('fs');
// const path = require('path');

// // Ensure the directory exists
// const uploadDir = path.join(__dirname, 'Uploads/Images'); // Adjust path if needed
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// MIME type mapping
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Multer setup
const fileUpload = multer({
    limits: { fileSize: 500000 }, // 50 KB limit
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'Uploads/Images'); // Ensure correct directory path
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv1() + '.' + ext); // Generate unique filename
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error('Invalid MIME type');
        cb(error, isValid); // Accept or reject file
    }
});

module.exports = fileUpload;