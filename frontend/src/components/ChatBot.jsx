import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            // Get context from localStorage (set by JobMatch or ResumeUpload)
            const resumeText = localStorage.getItem('lastResumeText');

            const response = await api.post('/resume/chat', {
                message: userMessage.content,
                history: chatHistory,
                context: {
                    resumeText,
                }
            });

            const botReply = { role: 'assistant', content: response.data.data.reply };
            setChatHistory(prev => [...prev, botReply]);
        } catch (error) {
            console.error('Chat error:', error);
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Is the backend running?'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-primary-600 hover:bg-primary-500'
                    }`}
            >
                {isOpen ? (
                    <span className="text-2xl">✕</span>
                ) : (
                    <span className="text-2xl">💬</span>
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-4 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm">🤖</div>
                            <div>
                                <h4 className="text-sm font-bold">ResumeAI Assistant</h4>
                                <p className="text-[10px] text-emerald-400">Online | AI Career Coach</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-8 opacity-50">
                                <span className="text-4xl block mb-2">👋</span>
                                <p className="text-sm">Hi! Ask me anything about your resume or how to tailor it for a job.</p>
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <ReactMarkdown
                                            className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:p-2 prose-pre:rounded-lg"
                                            components={{
                                                h3: ({ node, ...props }) => <h3 className="text-primary-400 font-bold mt-2 mb-1" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
                                                strong: ({ node, ...props }) => <span className="font-bold text-white" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/30 border-t border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors pr-10"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || isLoading}
                                className="absolute right-2 top-1.5 text-primary-500 hover:text-primary-400 disabled:opacity-30 transition-colors"
                            >
                                <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
