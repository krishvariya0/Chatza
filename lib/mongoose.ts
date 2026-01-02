// import mongoose from "mongoose";

// // const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// // console.log("MongoDB URI:", MONGODB_URI);

// // if (!MONGODB_URI) {
// //   throw new Error("Please define MONGODB_URI in .env.local");
// // }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = {
//     conn: null,
//     promise: null,
//   };
// }

// export async function connectToDatabase() {
// console.log("MongoDB URI:", "mongodb://localhost:27017/Chatza");

//   if (cached.conn) {
//     return cached.conn;
//   }
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGODB_URL || " ", {
//       // dbName: "Chatza",
//     });

//   }

//   cached.conn = await cached.promise;
//   console.log("✅ MongoDB connected");
//   return cached.conn;
// }


import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose?: MongooseCache;
}

let cached = (global as GlobalWithMongoose).mongoose;

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

