require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const BASE_PORT = Number.parseInt(process.env.PORT || '3000', 10);
const MAX_PORT_ATTEMPTS = Number.parseInt(process.env.MAX_PORT_ATTEMPTS || '10', 10);

function startHttpServer(port, attemptsLeft) {
  const server = app.listen(port, () => {
    console.log(`sportsGoodsStore running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`Port ${port} is busy. Retrying on ${port + 1}...`);
      return startHttpServer(port + 1, attemptsLeft - 1);
    }

    if (error.code === 'EADDRINUSE') {
      console.error(
        `Failed to start server: ports ${BASE_PORT}-${BASE_PORT + MAX_PORT_ATTEMPTS} are already in use. ` +
        'Stop the existing process or set a different PORT in .env.'
      );
      process.exit(1);
    }

    console.error('HTTP server error:', error.message);
    process.exit(1);
  });
}

async function start() {
  await connectDB();
  startHttpServer(BASE_PORT, MAX_PORT_ATTEMPTS);
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});