"use client";
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import CrisisCard from './CrisisCard';
import { CRISIS_RESOURCES } from '../utils/safety';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! 👋 I’m SobatMinda. I’m here to listen and support you. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [crisisResources, setCrisisResources] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            });

            const data = await res.json();

            if (data.isCrisis) {
                setCrisisResources(data.resources);
            }

            setMessages(prev => [...prev, { role: data.role, content: data.content }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of trouble connecting right now. 😔 Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualHelp = () => {
        setCrisisResources(CRISIS_RESOURCES);
    };

    return (
        <div className={styles.chatContainer}>
            <CrisisCard resources={crisisResources} onClose={() => setCrisisResources(null)} />

            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.avatar}>SM</div>
                    <div>
                        <h1 className={styles.title}>SobatMinda</h1>
                        <p className={styles.status}>Online • Your Digital Buddy</p>
                    </div>
                </div>
                <button onClick={handleManualHelp} className={styles.helpButton} aria-label="Get Help">
                    SOS 🆘
                </button>
            </header>

            <div className={styles.messagesArea}>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} role={msg.role} content={msg.content} />
                ))}
                {isLoading && <div className={styles.typingIndicator}>SobatMinda is typing...</div>}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
                <input
                    type="text"
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                    disabled={isLoading || !!crisisResources}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={isLoading || !input.trim() || !!crisisResources}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
