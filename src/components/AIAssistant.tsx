/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CareerAnalysisResult, ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, ArrowRight, CornerDownLeft, CircleAlert } from 'lucide-react';

interface AIAssistantProps {
  data: CareerAnalysisResult;
}

const QUICK_PROMPTS = [
  "What should I learn next?",
  "How do I become an AI Engineer?",
  "Am I ready for internships?",
  "What projects should I build?"
];

export default function AIAssistant({ data }: AIAssistantProps) {
  const { profile, scores } = data;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "assistant",
      text: `Hello ${profile.name}! I am your automated Career GPS Strategist. Currently targetting **${profile.careerTarget}** with **${scores.careerReadiness}%** readiness score.\n\nType of query you can ask me: what are my critical gaps, which project boosts portfolio rating, how do I apply for internships? Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          messages: [...messages, userMessage],
          latestMessage: text.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Network error occured while requesting career telemetry advice.');
      }

      const result = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: result.text || "I was unable to structure an active telemetry response. Let's try specifying your profile further.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI assistant route failed:', err);
      setErrorMsg('API Assistant failed to reply. Utilizing fallback simulation: please ensure server is listening on port 3000.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="ai-assistant-terminal" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[580px] items-stretch">
      
      {/* Left sidebar: prompt triggers */}
      <div className="lg:col-span-4 p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-500" /> Career GPS triggers
            </h3>
            <p className="text-xs text-slate-500 leading-normal leading-relaxed">
              Click custom contextual guidelines to seed active strategist dialogues instantaneously.
            </p>
          </div>

          <div className="space-y-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                id={`ai-quick-${prompt.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-slate-50/20 text-xs font-semibold text-slate-700 transition flex items-center justify-between group cursor-pointer disabled:opacity-50"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100/50 rounded-xl">
          <p className="text-[11px] text-blue-800 leading-relaxed">
            * <strong>Personalized context</strong>: The assistant reads active strengths and missing targets within other dashboards to provide tailored advice.
          </p>
        </div>
      </div>

      {/* Right chat logs system */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
        
        {/* Chat Logs Header */}
        <div className="p-4 border-b border-rose-50/5 bg-slate-50 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center p-1.5 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Career GPS Assistant</h4>
              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Contextual AI Online
              </span>
            </div>
          </div>
        </div>

        {/* Message scroll container */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px]">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-end'}`}
              >
                <div className={`p-2 rounded-full leading-none shrink-0 border ${
                  isAI ? 'bg-slate-50 text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isAI 
                      ? 'bg-slate-50 border border-slate-200/60 text-slate-800 rounded-tl-none' 
                      : 'bg-blue-600 text-white rounded-br-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 block px-1 text-right font-semibold">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-start">
              <div className="p-2 rounded-full leading-none shrink-0 border bg-slate-50 text-blue-600">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl text-xs bg-slate-50 border border-slate-200/60 text-slate-500 rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span>GPS is plotting strategic guides...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2.5">
              <CircleAlert className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800 leading-normal font-medium">{errorMsg}</p>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input area */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
          className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2 items-center"
        >
          <input 
            type="text" 
            id="chat-input"
            placeholder="Type your career strategy question here..." 
            className="flex-1 px-4 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            id="chat-send-btn"
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-55"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
