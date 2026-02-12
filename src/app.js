const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const buildSessionMiddleware = require('./config/session');
const apiRoutes = require('./routes/apiRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(buildSessionMiddleware());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.get('/health', (req, res) => res.json({ ok: true, project: 'sportsGoodsStore' }));
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

app.use((req, res) => res.status(404).render('pages/not-found'));
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ message: 'Internal server error', detail: err.message });
  }
  return res.status(500).render('pages/error', { error: err.message });
});

module.exports = app;
