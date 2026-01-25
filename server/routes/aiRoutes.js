const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received AI Request:', message);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Fallback to the stable 'gemini-pro' model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});

module.exports = router;
