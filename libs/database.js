import mongoose from 'mongoose';

// this connects the app to MongoDB
export function connect() {
    // Add mongoose connection to follow waht is happening with the connection
    mongoose.connection.on("error", (err) => console.log("[M] Error ", err));
    mongoose.connection.on("connecting", () => console.log("[M] Connecting"));
    mongoose.connection.on("connected", () => console.log("[M] Connected"));
    mongoose.connection.on("disconnecting", () => console.log("[M] Disconnecting"));
    mongoose.connection.on("disconnected", () => console.log("[M] Disonnected"));
    
    // destructure DB variables from environment variables
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

    const connStr = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

    // without the return the function returns undefined
    return mongoose.connect(connStr);
}