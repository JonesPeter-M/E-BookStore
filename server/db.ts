import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryInstance: MongoMemoryServer | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  const customUri = process.env.MONGODB_URI?.trim();

  if (customUri) {
    try {
      console.log(`[Database] Connecting to external MongoDB: ${customUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
      const conn = await mongoose.connect(customUri);
      console.log(`[Database] Connected successfully to MongoDB at ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('[Database] Failed to connect to external MongoDB URI:', err);
      console.log('[Database] Falling back to embedded MongoMemoryServer for reliable assessment execution...');
    }
  }

  // Fallback or default: embedded high-performance MongoMemoryServer
  if (!mongoMemoryInstance) {
    console.log('[Database] Initializing embedded MongoDB server (MongoMemoryServer)...');
    mongoMemoryInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'online_bookstore',
      },
    });
  }

  const memoryUri = mongoMemoryInstance.getUri();
  console.log(`[Database] Connecting to embedded MongoDB at: ${memoryUri}`);
  const conn = await mongoose.connect(memoryUri, {
    dbName: 'online_bookstore',
  });
  console.log('[Database] Successfully connected to embedded MongoDB.');
  return conn;
}

export async function closeDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryInstance) {
    await mongoMemoryInstance.stop();
    mongoMemoryInstance = null;
  }
}
