
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou seu assistente SignPlus. Como posso ajudar com suas assinaturas digitais hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await geminiService.askAssistant(userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-end p-6 pointer-events-none">
      <div className="w-full max-w-md h-[600px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col pointer-events-auto animate-in slide-in-from-right-8 duration-500 overflow-hidden">
        <header className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-xl animate-pulse">✨</div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest">SignPlus AI</h3>
              <p className="text-[10px] text-blue-400 font-bold uppercase">Online • Gemini 3 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl opacity-50 hover:opacity-100 transition-opacity">&times;</button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        <footer className="p-6 bg-white border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pergunte algo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-slate-100 border-none rounded-2xl pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              ➔
            </button>
          </div>
          <p className="text-[9px] text-slate-400 text-center mt-3 font-bold uppercase tracking-widest">Tecnologia Google Gemini • IA pode falhar</p>
        </footer>
      </div>
    </div>
  );
};

export default AIAssistantModal;
