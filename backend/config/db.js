const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.log('⚠️ Running server without database connection. Features requiring storage will be disabled, but parsing will work.');
        // process.exit(1); // Disabled to allow server to run without DB
    }
};

module.exports = connectDB;
