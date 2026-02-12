const session = require('express-session');
const MongoStore = require('connect-mongo');

function buildSessionMiddleware() {
  const common = {
    secret: process.env.SESSION_SECRET || 'unsafe-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  };

  if (process.env.SKIP_DB === 'true') {
    return session(common);
  }

  return session({
    ...common,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24
    })
  });
}

module.exports = buildSessionMiddleware;
