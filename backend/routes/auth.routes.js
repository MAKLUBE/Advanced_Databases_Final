const router = require('express').Router();
const User = require('../models/User');

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.role = user.role || 'customer';
    req.session.username = user.username;

    res.json({ message: 'Logged in', role: req.session.role, username: user.username });
  } catch (e) { next(e); }
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.json({ loggedIn: false });
  }
  res.json({ loggedIn: true, role: req.session.role, username: req.session.username });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already exists' });

    const user = await User.create({ username, password, role: 'customer' });
    res.json(user);
  } catch (e) { next(e); }
});

module.exports = router;
