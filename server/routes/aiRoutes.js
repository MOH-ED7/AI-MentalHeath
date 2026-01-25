const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Add GET method for browser testing
router.get('/chat', (req, res) => {
    res.send('✅ AI Chat Endpoint is Ready! (Use POST request to send messages)');
});

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received AI Request:', message);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Use the model defined in .env, or fallback to 'gemini-1.5-flash'
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `You are a compassionate mental health AI assistant. 
    Your goal is to listen, provide empathetic support, and suggest coping strategies. 
    You are NOT a doctor and cannot diagnose. Always encourage professional help if things seem serious.
    User says: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        // Log more details if available
        if (error.response) {
            console.error('Gemini API Error Response:', JSON.stringify(error.response, null, 2));
        }

        // Handle Rate Limiting (429) - Check multiple possible locations for status
        if (error.status === 429 ||
            error.response?.status === 429 ||
            error.message?.includes('429') ||
            error.message?.includes('Quota') ||
            error.message?.includes('Too Many Requests')) {

            console.log("Rate Limit Hit. Sending polite warning to user.");
            return res.json({
                reply: "I'm receiving too many messages at once! 🤯 Please wait 1 minute and try again."
            });
        }

        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});

module.exports = router;
