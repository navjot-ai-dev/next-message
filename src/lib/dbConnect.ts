import mongoose from "mongoose";
import dns from "dns/promises";

// Force Node to use Google's DNS — must be set before any DNS lookups happen
dns.setServers(['8.8.8.8', '8.8.4.4']);

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

    console.log(process.env.MONGODB_URI);
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }
    try {
        // Test DNS before mongoose connects
        const srv = await dns.resolveSrv(
            "_mongodb._tcp.cluster1.wlw452f.mongodb.net"
        );

        console.log("Mongo DNS:", srv);

        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        console.log(db);

        connection.isConnected = db.connections[0].readyState

        console.log("Connected to database");

    } catch (error) {

        console.error("Error connecting to database:", error);

        process.exit(1); // Exit the process with an error code

    } 
}

export default dbConnect;