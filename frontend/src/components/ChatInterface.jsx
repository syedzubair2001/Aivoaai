import React, { useState, useRef, useEffect } from 'react';
import { useSendChatMessageMutation } from '../store/apiSlice';
import { Send } from 'lucide-react';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I am your AI assistant. You can tell me to log an interaction, fetch HCP details, look at history, or schedule a follow-up visit. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [sendMessage, { isLoading }] = useSendChatMessageMutation();
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        try {
            const res = await sendMessage({ message: userMsg }).unwrap();
            setMessages(prev => [...prev, { role: 'ai', content: res.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, there was an error processing your request." }]);
        }
    };

    return (
        <div className="card chat-container">
            <div className="chat-history">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message ai">
                        Agent is thinking...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="chat-input-area">
                <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    placeholder="E.g. Log a 25 min virtual visit with Dr. Smith discussing WonderDrug..." 
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
