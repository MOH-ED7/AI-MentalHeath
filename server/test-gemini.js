require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (error) {
        console.error("Error testing Gemini:", error.message);
        if (error.message.includes('404')) {
            console.log("TRYING TO LIST MODELS...");
            // List models manually
            const key = process.env.GEMINI_API_KEY;
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
            const r = await fetch(url);
            const d = await r.json();
            if (d.models) {
                console.log("AVAILABLE MODELS:");
                d.models.forEach(m => {
                    if (m.name.includes('gemini')) console.log(m.name);
                });
            } else {
                console.log("COULD NOT LIST MODELS:", d);
            }
        }
        if (error.response) {
            console.error("Details:", JSON.stringify(error.response, null, 2));
        }
    }

    // Also try to list models if possible (though SDK might not expose it easily in all versions, let's try a simple prompt first)
}

testGemini();
