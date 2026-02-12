function ensureAuth(req, res, next) {
  if (!req.session.userId) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    return res.redirect('/login');
  }
  return next();
}

function ensureAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
}

module.exports = { ensureAuth, ensureAdmin };
