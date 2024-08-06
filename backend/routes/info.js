const express = require('express');
const router = express.Router();
const Info = require('../models/Info');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch user's infos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const infos = await Info.find({ userId: req.user.id });
    res.json({ infos });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add new info
router.post('/add', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  console.log('Request body:', req.body); // Log request body
  console.log('User ID:', userId); // Log user ID

  try {
    const newInfo = new Info({ title, content, userId });
    await newInfo.save();
    res.status(201).json({ msg: 'Information added successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
