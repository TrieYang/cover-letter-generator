require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

app.use(bodyParser.json());

// Enable CORS
app.use(cors({
  origin: 'chrome-extension://badpgnalpjhhijdcegejdccacjkofkba' // Replace with your extension's ID
}));

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const mongoURI = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=cover-letter-generator`;
console.log('MongoDB connection URL:', mongoURI);
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);

// Protect the /main route with the authMiddleware
app.get('/main', authMiddleware, (req, res) => {
  res.json({ msg: 'Welcome to the main page!' });
});

const PORT = process.env.PORT || 5001; // Change the port number here if needed
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



