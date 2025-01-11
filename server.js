const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const app = express();

const PORT = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kedar',
    database: 'digital_bill_book'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database.');
});

// Middleware for parsing requests and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// File upload configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to create a bill
app.post('/api/bills', upload.single('productPhoto'), (req, res) => {
    const { customerName, customerAddress, billDate, billAmount } = req.body;
    const productPhoto = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `INSERT INTO orders (customerName, customerAddress, billDate, billAmount, productPhoto) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [customerName, customerAddress, billDate, billAmount, productPhoto], (err, result) => {
        if (err) throw err;

        res.json({
            success: true,
            customerName,
            customerAddress,
            billDate,
            billAmount,
            productPhoto
        });
    });
});

// Endpoint to search customers
app.get('/api/search', (req, res) => {
    const { name } = req.query;

    const query = `SELECT * FROM orders WHERE customerName LIKE ?`;
    db.query(query, [`%${name}%`], (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
