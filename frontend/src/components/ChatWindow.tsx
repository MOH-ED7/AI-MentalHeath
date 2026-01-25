import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import CrisisCard from './CrisisCard';
import { CRISIS_RESOURCES, type CrisisResources } from '../utils/safety';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}



export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi there! 👋 I’m SobatMinda. I’m here to listen and support you. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [crisisResources, setCrisisResources] = useState<CrisisResources | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Note: Update URL if needed. Assuming server runs on port 5000.
            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }) // Backend expects { message: string }
            });

            const data: any = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Server error');
            }

            // Note: Backend integration for crisis detection can be added here
            // if (data.isCrisis) {
            //     setCrisisResources(data.resources);
            // }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error: any) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${error.message || "Failed to connect"}. Please try again.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualHelp = () => {
        setCrisisResources(CRISIS_RESOURCES);
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-xl overflow-hidden font-sans">
            <CrisisCard resources={crisisResources} onClose={() => setCrisisResources(null)} />

            {/* Header */}
            <header className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                        SM
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-primary">SobatMinda</h1>
                        <p className="text-xs text-accent font-medium">Online • Your Digital Buddy Phone</p>
                    </div>
                </div>
                <button
                    onClick={handleManualHelp}
                    className="bg-red-100 text-red-600 border border-red-200 rounded-lg px-3 py-1.5 font-bold text-xs hover:bg-red-200 transition"
                    aria-label="Get Help"
                >
                    SOS 🆘
                </button>
            </header>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-bg-color">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                    <div className="text-xs text-gray-500 italic ml-4 mb-4">
                        SobatMinda is typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="p-4 border-t border-gray-200 bg-white flex gap-3" onSubmit={handleSend}>
                <input
                    type="text"
                    className="flex-1 p-3 border border-gray-300 rounded-full outline-none text-base focus:border-primary transition"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                    disabled={isLoading || !!crisisResources}
                />
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-light disabled:bg-gray-400 text-white rounded-full px-6 font-bold transition-colors"
                    disabled={isLoading || !input.trim() || !!crisisResources}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
