import { MongoClient } from 'mongodb';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Mock data for development
const mockLeaderboardData = [
  { _id: '1', userId: 'user1', name: 'John Doe', score: 800 },
  { _id: '2', userId: 'user2', name: 'Jane Smith', score: 600 },
  { _id: '3', userId: 'user3', name: 'Bob Johnson', score: 400 },
  { _id: '4', userId: 'user4', name: 'Alice Brown', score: 200 },
  { _id: '5', userId: 'user5', name: 'Michael Wilson', score: 1000 },
];

// Mock MongoDB client for development
class MockMongoClient {
  db(dbName: string) {
    return {
      collection(collectionName: string) {
        return {
          find() {
            return {
              sort() {
                return {
                  limit() {
                    return {
                      toArray: async () => {
                        if (collectionName === 'leaderboard') {
                          return mockLeaderboardData;
                        }
                        return [];
                      }
                    };
                  }
                };
              }
            };
          },
          updateOne(query: any, update: any, options: any) {
            return Promise.resolve({ modifiedCount: 1, upsertedId: null });
          },
          insertOne(doc: any) {
            return Promise.resolve({ insertedId: 'new-id' });
          }
        };
      }
    };
  }
}

// Use real MongoDB in production, mock in development if no URI is provided
if (!isDev && !process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rento';
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (isDev && !process.env.MONGODB_URI) {
  // In development, use mock client if no MongoDB URI is provided
  console.warn('Using mock MongoDB client for development. Add MONGODB_URI to .env.local for real database.');
  client = new MockMongoClient() as unknown as MongoClient;
  clientPromise = Promise.resolve(client);
} else {
  // In production, use real MongoDB client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;