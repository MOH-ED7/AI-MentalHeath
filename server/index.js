const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('AI Mental Health API is running');
});

const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log(`Attempting to connect to Cloud MongoDB...`);
        // Set a timeout for cloud connection to avoid long waits
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to Cloud MongoDB');
    } catch (err) {
        console.warn('Cloud MongoDB connection failed:', err.message);

        // Fallback to local
        try {
            console.log('Attempting fallback to Local MongoDB...');
            await mongoose.connect('mongodb://localhost:27017/ai-mental-health', { serverSelectionTimeoutMS: 2000 });
            console.log('Connected to Local MongoDB');
            return;
        } catch (localErr) {
            console.warn('Local MongoDB fallback failed.');
        }

        // Final Fallback: In-Memory MongoDB
        try {
            console.log('Starting In-Memory MongoDB (Temporary)...');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('Connected to In-Memory MongoDB. (Data will be lost on restart)');
            return;
        } catch (memErr) {
            console.error('All database connection attempts failed.', memErr);
        }
    }
};

connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
