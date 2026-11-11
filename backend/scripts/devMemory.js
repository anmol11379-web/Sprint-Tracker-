require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('../config/db');
const app = require('../server');

const PORT = process.env.PORT || 5000;

const startWithMemoryDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  await connectDB();
  console.log('Running with ephemeral in-memory MongoDB (data resets on exit).');

  const server = app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await mongoServer.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startWithMemoryDB().catch((error) => {
  console.error(`Failed to start dev:memory server: ${error.message}`);
  process.exit(1);
});

