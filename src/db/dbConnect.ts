import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}
if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URI, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
export const dbConnect = async () => {
  const mongoose = await import("mongoose");
  mongoose.set("strictQuery", true);
  
  if ((mongoose.connection.readyState === 1)) return;

  if (!MONGO_URI) throw new Error("Please define MONGO_URI");

  try {
    await mongoose.connect(MONGO_URI, {bufferCommands: false});
    console.log("Connected via mongoose");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;