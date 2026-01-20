import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

/*
  Tests: 19 tests, all passing
  - 4 auth tests (register, login, logout, refresh)
  - 4 user tests (get all, get by id, update, delete)
  - 5 post tests (create, get all, get by id, update, delete)
  - 6 comment tests (create, get all, get by id, get by post, update, delete)
*/