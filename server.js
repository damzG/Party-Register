require('dotenv').config();  // must be at the very top
console.log('process.env.SECRET_KEY:', process.env.SECRET_KEY);
console.log('process.env.ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);

const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

console.log('SECRET_KEY:', SECRET_KEY);  // after you define SECRET_KEY
console.log('ADMIN_PASSWORD:', ADMIN_PASSWORD);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const Person = require('./models/Person');



const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional fallback route (only if needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// API route for register
app.post('/register', async (req, res) => {
    try {
        const { type, names } = req.body;
        if (!type || !names || names.length === 0) {
            return res.status(400).json({ error: 'Missing data' });
        }

        const newPerson = new Person({ type, names });
        await newPerson.save();
        res.status(201).json({ message: 'Registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// View all registered guests
app.get('/guests', async (req, res) => {
    try {
        const guests = await Person.find().sort({ _id: -1 }); // newest first
        res.status(200).json(guests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching guests' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});






// Middleware to protect admin routes
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.admin = decoded;
    next();
  });
}


// Protect the /admin/guests API
app.get('/admin/guests', adminAuth, async (req, res) => {
  try {
    const guests = await Person.find({});
    res.json(guests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

//Export features as CSV
const { Parser } = require('json2csv'); // npm install json2csv

app.get('/admin/export', adminAuth, async (req, res) => {
  try {
    const guests = await Person.find({}).lean();

    const fields = ['_id', 'type', 'names'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(guests);

    res.header('Content-Type', 'text/csv');
    res.attachment('registered_guests.csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});





// Admin login route
app.post('/admin/login', (req, res) => {
    console.log('Login attempt with password:', req.body.password);
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});


// Serve admin login page
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});
