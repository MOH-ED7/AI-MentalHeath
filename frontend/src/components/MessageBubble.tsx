import React from 'react';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
    const isUser = role === 'user';
    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`
                    max-w-[80%] p-4 rounded-2xl text-base leading-relaxed shadow-sm
                    ${isUser
                        ? 'bg-chat-user text-text-main rounded-br-sm'
                        : 'bg-chat-ai text-text-main rounded-bl-sm border border-gray-100'}
                `}
            >
                {content}
            </div>
        </div>
    );
};

export default MessageBubble;
