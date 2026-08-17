import mongoose from "mongoose";
import dns from "dns/promises";

dns.setServers(["10.37.221.136"]);

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const MONGODB_URI = process.env.next_message_MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    const db = await mongoose.connect(MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export default dbConnect;