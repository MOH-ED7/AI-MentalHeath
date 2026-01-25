const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    userId: {
        type: String, // Ideally this would be an ObjectId referencing a User model
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
        enum: ['Happy', 'Sad', 'Anxious', 'Neutral', 'Angry'],
        default: 'Neutral',
    },
    aiResponse: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Entry', entrySchema);
