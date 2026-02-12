const User = require('../models/User');

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  req.session.userId = user._id.toString();
  req.session.role = user.role;

  return res.status(201).json({ message: 'Registered', user: { id: user._id, name: user.name, email: user.email } });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.userId = user._id.toString();
  req.session.role = user.role;

  return res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
}

async function me(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = await User.findById(req.session.userId).select('-passwordHash');
  return res.json(user);
}

module.exports = { register, login, logout, me };
