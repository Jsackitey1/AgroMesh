const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('../config');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/agromesh';
const MEMORY_DB_PATH = path.join(process.cwd(), '.agromesh', 'mongo-data');

let memoryServer = null;
let hasLoggedReady = false;

const shouldFallbackToMemory = (error) => {
  if (!config.server.isDevelopment) {
    return false;
  }

  const message = error?.message || '';
  const reasonMessage = error?.reason?.message || '';

  return message.includes('ECONNREFUSED') ||
    reasonMessage.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND') ||
    reasonMessage.includes('ENOTFOUND');
};

const ensureMemoryDbPath = () => {
  if (!fs.existsSync(MEMORY_DB_PATH)) {
    fs.mkdirSync(MEMORY_DB_PATH, { recursive: true });
  }
};

const stopMemoryServer = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

process.once('SIGINT', async () => {
  await stopMemoryServer();
});

process.once('SIGTERM', async () => {
  await stopMemoryServer();
});

async function connectDB() {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected at ${uri}`);
    if (!hasLoggedReady) {
      hasLoggedReady = true;
    }
  } catch (error) {
    if (shouldFallbackToMemory(error)) {
      try {
        console.warn('⚠️  Local MongoDB not running. Starting embedded MongoDB for development...');
        ensureMemoryDbPath();
        if (!memoryServer) {
          memoryServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'agromesh',
            dbPath: MEMORY_DB_PATH,
            storageEngine: 'wiredTiger',
          },
          });
        }
        const memoryUri = memoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.info(`✅ Embedded MongoDB started at ${memoryUri}`);
        console.info(`ℹ️  Data persisted under ${MEMORY_DB_PATH}. Set MONGODB_URI to use an external database.`);
      } catch (memoryError) {
        console.error('❌ Failed to start in-memory MongoDB instance.', memoryError);
        process.exit(1);
      }
    } else {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
}

mongoose.connection.on('disconnected', async () => {
  if (!config.server.isProduction) {
    console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
    try {
      if (!memoryServer) {
        await connectDB();
      } else if (mongoose.connection.readyState === 0) {
        await mongoose.connect(memoryServer.getUri());
      }
    } catch (err) {
      console.error('❌ MongoDB reconnection failed:', err);
    }
  }
});

module.exports = connectDB;
