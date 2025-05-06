import { MongoClient } from 'mongodb';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Define types for our mock data
type LeaderboardEntry = {
  _id: string;
  ownerId: string;
  name: string;
  score: number;
  team?: string;
};

type Property = {
  _id: string;
  ownerId: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  amenities: string[];
  images: string[];
  available: boolean;
};

type Issue = {
  _id: string;
  tenantId: string;
  propertyId: string;
  ownerId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

type Payment = {
  _id: string;
  tenantId: string;
  propertyId: string;
  ownerId: string;
  amount: number;
  method: string;
  status: string;
  timestamp: string;
};

type Notification = {
  _id: string;
  userId: string;
  type: string;
  message: string;
  issueId?: string;
  paymentId?: string;
  read: boolean;
  timestamp: string;
};

// Mock data for development
const mockLeaderboardData: LeaderboardEntry[] = [
  { _id: '1', ownerId: 'user1', name: 'John Doe', score: 800 },
  { _id: '2', ownerId: 'user2', name: 'Jane Smith', score: 600 },
  { _id: '3', ownerId: 'user3', name: 'Bob Johnson', score: 400 },
  { _id: '4', ownerId: 'user4', name: 'Alice Brown', score: 200 },
  { _id: '5', ownerId: 'user5', name: 'Michael Wilson', score: 1000 },
];

// Mock properties data
const mockPropertiesData: Property[] = [
  {
    _id: 'prop1',
    ownerId: 'user1',
    title: 'Modern Downtown Apartment',
    address: '123 Main St, New York, NY',
    price: 2500,
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    description: 'Beautiful apartment in the heart of downtown',
    amenities: ['Parking', 'Gym', 'Pool'],
    images: ['apartment1.jpg', 'apartment1-2.jpg'],
    available: true
  },
  {
    _id: 'prop2',
    ownerId: 'user2',
    title: 'Cozy Suburban House',
    address: '456 Oak Ave, Boston, MA',
    price: 3200,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    description: 'Spacious family home in quiet neighborhood',
    amenities: ['Backyard', 'Garage', 'Fireplace'],
    images: ['house1.jpg', 'house1-2.jpg'],
    available: true
  }
];

// Mock issues data
const mockIssuesData: Issue[] = [
  {
    _id: 'issue1',
    tenantId: 'tenant1',
    propertyId: 'prop1',
    ownerId: 'user1',
    title: 'Leaking Faucet',
    description: 'The kitchen faucet is leaking constantly',
    status: 'pending',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    completedAt: null
  },
  {
    _id: 'issue2',
    tenantId: 'tenant2',
    propertyId: 'prop2',
    ownerId: 'user2',
    title: 'Broken Heater',
    description: 'The heater is not working properly',
    status: 'in-progress',
    createdAt: '2023-05-10T14:20:00Z',
    updatedAt: '2023-05-12T09:15:00Z',
    completedAt: null
  },
  {
    _id: 'issue3',
    tenantId: 'tenant1',
    propertyId: 'prop1',
    ownerId: 'user1',
    title: 'Noisy Neighbor',
    description: 'The neighbor plays loud music late at night',
    status: 'completed',
    createdAt: '2023-04-28T18:45:00Z',
    updatedAt: '2023-05-05T11:30:00Z',
    completedAt: '2023-05-05T11:30:00Z'
  }
];

// Mock payments data
const mockPaymentsData: Payment[] = [
  {
    _id: 'payment1',
    tenantId: 'tenant1',
    propertyId: 'prop1',
    ownerId: 'user1',
    amount: 2500,
    method: 'credit_card',
    status: 'completed',
    timestamp: '2023-05-01T12:00:00Z'
  },
  {
    _id: 'payment2',
    tenantId: 'tenant2',
    propertyId: 'prop2',
    ownerId: 'user2',
    amount: 3200,
    method: 'bank_transfer',
    status: 'pending',
    timestamp: '2023-05-02T15:30:00Z'
  }
];

// Mock notifications data
const mockNotificationsData: Notification[] = [
  {
    _id: 'notif1',
    userId: 'user1',
    type: 'new_issue',
    message: 'New issue reported: Leaking Faucet',
    issueId: 'issue1',
    read: false,
    timestamp: '2023-05-15T10:30:00Z'
  },
  {
    _id: 'notif2',
    userId: 'tenant1',
    type: 'issue_update',
    message: 'Your issue "Noisy Neighbor" has been resolved',
    issueId: 'issue3',
    read: true,
    timestamp: '2023-05-05T11:30:00Z'
  },
  {
    _id: 'notif3',
    userId: 'user2',
    type: 'payment',
    message: 'New payment of 3200 received for property Cozy Suburban House',
    paymentId: 'payment2',
    read: false,
    timestamp: '2023-05-02T15:30:00Z'
  }
];

// Define a type for our in-memory database
type InMemoryDb = {
  leaderboard: LeaderboardEntry[];
  properties: Property[];
  issues: Issue[];
  payments: Payment[];
  notifications: Notification[];
};

// Store mock data in memory to persist changes during development
let inMemoryDb: InMemoryDb = {
  leaderboard: [...mockLeaderboardData],
  properties: [...mockPropertiesData],
  issues: [...mockIssuesData],
  payments: [...mockPaymentsData],
  notifications: [...mockNotificationsData]
};

// Define types for MongoDB operations
type MongoQuery = Record<string, any>;
type MongoUpdate = {
  $set?: Record<string, any>;
  $inc?: Record<string, number>;
  $setOnInsert?: Record<string, any>;
};
type MongoOptions = {
  upsert?: boolean;
};

// Mock MongoDB client for development
class MockMongoClient {
  db(dbName: string) {
    return {
      collection(collectionName: string) {
        return {
          find(query: MongoQuery = {}) {
            // Filter the in-memory data based on query
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collectionData = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            let results = [...collectionData] as any[];

            // Apply simple filtering if query has properties
            if (Object.keys(query).length > 0) {
              results = results.filter(item => {
                return Object.entries(query).every(([key, value]) => {
                  if (key === '_id' && typeof value === 'object' && value !== null && '$in' in value) {
                    // Handle $in operator for _id
                    const inArray = value.$in as any[];
                    return inArray.includes(item._id);
                  }
                  return item[key] === value;
                });
              });
            }

            return {
              sort(sortOptions: Record<string, number> = {}) {
                // Apply simple sorting if sortOptions has properties
                if (Object.keys(sortOptions).length > 0) {
                  const [sortKey, sortOrder] = Object.entries(sortOptions)[0];
                  results.sort((a, b) => {
                    const aValue = a[sortKey];
                    const bValue = b[sortKey];
                    return sortOrder === 1
                      ? (aValue > bValue ? 1 : -1)
                      : (aValue < bValue ? 1 : -1);
                  });
                }

                return {
                  limit(limit = 20) {
                    return {
                      toArray: async () => {
                        return results.slice(0, limit);
                      }
                    };
                  },
                  toArray: async () => {
                    return results;
                  }
                };
              },
              toArray: async () => {
                return results;
              }
            };
          },
          findOne(query: MongoQuery = {}) {
            // Get the collection
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collection = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            const collectionArray = collection as any[];

            // Try to match by _id first
            if (query._id) {
              const id = query._id.toString ? query._id.toString() : query._id;
              const item = collectionArray.find(item => item._id.toString() === id);
              return Promise.resolve(item || null);
            }

            // Otherwise, try to match the first property in the query
            for (const key in query) {
              const value = query[key];
              const item = collectionArray.find(item => item[key] === value);
              if (item) return Promise.resolve(item);
            }

            return Promise.resolve(null);
          },
          updateOne(query: MongoQuery, update: MongoUpdate, options: MongoOptions = {}) {
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collection = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            const collectionArray = collection as any[];
            let modifiedCount = 0;
            let upsertedId = null;

            // Find the index of the item to update
            let index = -1;
            if (query._id) {
              const id = query._id.toString ? query._id.toString() : query._id;
              index = collectionArray.findIndex(item => item._id.toString() === id);
            } else {
              // Try to match by any property in the query
              for (const key in query) {
                const value = query[key];
                index = collectionArray.findIndex(item => item[key] === value);
                if (index !== -1) break;
              }
            }

            if (index !== -1) {
              // Update existing item
              if (update.$set) {
                collectionArray[index] = { ...collectionArray[index], ...update.$set };
              }
              if (update.$inc) {
                for (const [key, value] of Object.entries(update.$inc)) {
                  const currentItem = collectionArray[index];
                  currentItem[key] = (currentItem[key] || 0) + Number(value);
                }
              }
              modifiedCount = 1;
            } else if (options.upsert) {
              // Insert new item if upsert is true
              const newId = 'new-id-' + Date.now();
              const newItem: Record<string, any> = {
                _id: newId,
                ...query,
                ...(update.$set || {}),
              };

              // Apply $setOnInsert if present
              if (update.$setOnInsert) {
                Object.assign(newItem, update.$setOnInsert);
              }

              // Apply $inc if present
              if (update.$inc) {
                for (const [key, value] of Object.entries(update.$inc)) {
                  newItem[key] = Number(value);
                }
              }

              collectionArray.push(newItem);
              upsertedId = newId;
            }

            return Promise.resolve({
              modifiedCount,
              upsertedId
            });
          },
          updateMany(query: MongoQuery, update: MongoUpdate) {
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collection = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            const collectionArray = collection as any[];
            let modifiedCount = 0;

            // Filter items that match the query
            collectionArray.forEach((item, index) => {
              let matches = true;

              // Check if item matches query
              for (const [key, value] of Object.entries(query)) {
                if (key === '_id' && typeof value === 'object' && value !== null && '$in' in value) {
                  // Handle $in operator for _id
                  const inArray = value.$in as any[];
                  matches = inArray.includes(item._id);
                } else {
                  matches = item[key] === value;
                }

                if (!matches) break;
              }

              if (matches) {
                // Update the item
                if (update.$set) {
                  collectionArray[index] = { ...collectionArray[index], ...update.$set };
                }
                modifiedCount++;
              }
            });

            return Promise.resolve({
              modifiedCount
            });
          },
          insertOne(doc: Record<string, any>) {
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collection = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            const collectionArray = collection as any[];
            const newId = doc._id || 'new-id-' + Date.now();
            const newDoc = { ...doc, _id: newId };

            collectionArray.push(newDoc);

            return Promise.resolve({
              insertedId: newId
            });
          },
          insertMany(docs: Record<string, any>[]) {
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collection = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            const collectionArray = collection as any[];
            const insertedIds = [];

            for (const doc of docs) {
              const newId = doc._id || 'new-id-' + Date.now() + Math.random().toString(36).substring(2, 9);
              const newDoc = { ...doc, _id: newId };

              collectionArray.push(newDoc);
              insertedIds.push(newId);
            }

            return Promise.resolve({
              insertedCount: docs.length,
              insertedIds
            });
          },
          deleteOne(query: MongoQuery) {
            const collectionKey = collectionName as keyof typeof inMemoryDb;
            const collection = collectionKey in inMemoryDb ? inMemoryDb[collectionKey] : [];
            const collectionArray = collection as any[];
            let deletedCount = 0;

            // Find the index of the item to delete
            let index = -1;
            if (query._id) {
              const id = query._id.toString ? query._id.toString() : query._id;
              index = collectionArray.findIndex(item => item._id.toString() === id);
            } else {
              // Try to match by any property in the query
              for (const key in query) {
                const value = query[key];
                index = collectionArray.findIndex(item => item[key] === value);
                if (index !== -1) break;
              }
            }

            if (index !== -1) {
              collectionArray.splice(index, 1);
              deletedCount = 1;
            }

            return Promise.resolve({
              deletedCount
            });
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





