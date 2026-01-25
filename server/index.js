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
        // detailed logs suppressed for cleaner output
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('   - Database Status: ✅ Connected to Cloud MongoDB');
    } catch (err) {
        // Fallback to local
        try {
            await mongoose.connect('mongodb://localhost:27017/ai-mental-health', { serverSelectionTimeoutMS: 2000 });
            console.log('   - Database Status: ✅ Connected to Local MongoDB');
            return;
        } catch (localErr) {
            // Internal silent failure
        }

        // Final Fallback: In-Memory MongoDB
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('   - Database Status: ✅ Connected to In-Memory MongoDB (Temporary)');
            return;
        } catch (memErr) {
            console.error('   - Database Status: ❌ Transformation Failed (All attempts failed)');
        }
    }
};

connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is RUNNING at: http://localhost:${PORT}`);
    console.log(`   - AI Chat Endpoint: http://localhost:${PORT}/api/ai/chat`);
});
