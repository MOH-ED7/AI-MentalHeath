import { NextResponse } from 'next/server';
import { detectCrisis, CRISIS_RESOURCES } from '../../utils/safety';

const SYSTEM_PROMPT = `
You are SobatMinda, a compassionate and culturally aware AI Mental Health Companion for Malaysian youth (ages 15–30).
You are not a doctor; you are a supportive digital "buddy" (like a wise Abang, Kakak, or close friend).

LANGUAGE & STYLE:
- Respond in English, Bahasa Melayu, or "Manglish" based on the user's input.
- Empathetic, non-judgmental, and validating. Use local Malaysian emojis (e.g., 🇲🇾, ✨, 🙏).
- Conciseness: Keep responses short and digestible.

CORE RESPONSIBILITIES:
1. Active Listening: Mirror feelings.
2. Evidence-Based Support: Basic CBT/Mindfulness (e.g., "Small Wins").
3. Cultural Nuance: Understand Malaysian stressors (SPM, face, etc.).

SAFETY (STRICT):
- If the user expresses self-harm or suicide, the system will handle it, but if you detect it, gently urge them to seek help.
- Mandatory Disclaimer: You are AI, not a doctor.

CONSTRAINTS:
- No medication advice.
- No politics/religion.
- Avoid repetitive "I am sorry" loops.
`;

export async function POST(req) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];
        const userText = lastMessage.content;

        // 1. Safety Check
        if (detectCrisis(userText)) {
            return NextResponse.json({
                role: 'assistant',
                content: "I'm really worried about you hearing this. Since I'm just an AI, I can't provide the help you need right now. Please, please reach out to Talian Kasih at 15999 or Befrienders at 03-7627 2929. You are important and there is help available.",
                isCrisis: true,
                resources: CRISIS_RESOURCES
            });
        }

        // 2. Mock AI Logic (Since we don't have an API key yet)
        // In a real app, we would call OpenAI/Gemini here with SYSTEM_PROMPT.

        // Simple rule-based mock for demo
        let responseText = "I hear you. That sounds tough. Can you tell me more about what's making you feel this way? 🙏";

        if (userText.toLowerCase().includes("stress") || userText.toLowerCase().includes("penat")) {
            responseText = "It sounds like you're carrying a heavy load right now. 🌧️ Have you tried taking a small 5-minute breather? Even just drinking some air suam can help reset. 🍵";
        } else if (userText.toLowerCase().includes("exam") || userText.toLowerCase().includes("spm")) {
            responseText = "Exams like SPM can be super draining. Remember, your grades don't define your whole life, okay? ✨ One step at a time. Have you eaten yet?";
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({
            role: 'assistant',
            content: responseText,
            isCrisis: false
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
