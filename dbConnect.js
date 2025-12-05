const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGOURL);
        if (conn.connection.readyState) {
            console.log("MongoDB Connected Successfully...");
        }
    } catch (error) {
        console.error("MongoDB Error ❌:", error.message);
        process.exit(1);
    }
}

connectDB();