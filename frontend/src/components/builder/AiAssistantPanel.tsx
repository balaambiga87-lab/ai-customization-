import React, { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

export function AiAssistantPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I am your AI Jewellery Assistant. Tell me what you want to build or ask me for advice!' }
  ]);
  const builderStore = useBuilderStore();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simulate backend AI parsing the intent for demo purposes
    // In production, this posts to the NestJS backend
    setTimeout(() => {
      let aiText = "I can help with that!";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('add') && lower.includes('chain')) {
        builderStore.setChain('chain_gold', 15000);
        aiText = "I've added a gorgeous 18k gold chain to the workspace.";
      } 
      else if (lower.includes('add') && lower.includes('diamond')) {
        builderStore.addPendant({
          id: Math.random().toString(),
          type: 'diamond_heart',
          position: [0, -1, 0.5],
          price: 25000
        });
        aiText = "A beautiful diamond heart pendant has been attached.";
      }
      else if (lower.includes('add') && lower.includes('ruby')) {
        builderStore.addPendant({
          id: Math.random().toString(),
          type: 'ruby_pendant',
          position: [0.5, -1, 0.5],
          price: 18000
        });
        aiText = "I've placed a stunning ruby pendant on your design.";
      }
      else if (lower.includes('remove') && lower.includes('all')) {
        builderStore.clearBuilder();
        aiText = "I've cleared the canvas for you to start fresh.";
      }
      else if (lower.includes('rose gold')) {
        builderStore.setMetalType('rose_gold', 1.1);
        aiText = "Changed the metal type to rose gold.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-stone-900 text-stone-100 flex items-center gap-2">
        <Sparkles size={20} className="text-amber-400" />
        <h3 className="font-semibold font-playfair tracking-wide">Jewellery AI</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Bot size={16} />
              </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
              msg.role === 'user' 
                ? 'bg-stone-900 text-white rounded-tr-sm' 
                : 'bg-white border border-stone-200 text-stone-700 rounded-tl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-stone-100 bg-white">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'Add a diamond pendant'..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
          />
          <button 
            type="submit" 
            className="absolute right-2 p-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
