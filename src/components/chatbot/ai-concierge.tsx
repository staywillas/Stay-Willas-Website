"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User } from "lucide-react";
import VillaCard from "@/components/home/villa-card";

type Role = "bot" | "user";

interface Message {
  id: string;
  role: Role;
  content: React.ReactNode | string;
  options?: string[];
}

// Mock Villa for recommendation
const recommendedVilla = {
  id: "the-glasshouse",
  name: "The Glasshouse Estate",
  location: "Lonavala",
  image: "/images/hero-villa.png",
  price: "45,000",
  guests: 8,
  bedrooms: 4,
  bathrooms: 4,
};

export default function AiConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<"greeting" | "budget" | "guests" | "recommendation">("greeting");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: "msg-1",
            role: "bot",
            content: "Welcome to Stay Willas. I am your Willa Assistant. Let's find your perfect escape. Where are you looking to travel?",
            options: ["Lonavala", "Alibaug", "Karjat", "Anywhere"],
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleOptionClick = (option: string, msgId: string) => {
    // Remove options from the message that was clicked so they don't stay on screen
    setMessages((prev) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, options: undefined } : msg))
    );

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: option },
    ]);

    // Bot response logic
    setTimeout(() => {
      if (stage === "greeting") {
        setStage("budget");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: `Excellent choice. What is your approximate budget per night?`,
            options: ["₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000+"],
          },
        ]);
      } else if (stage === "budget") {
        setStage("guests");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Got it. And how many guests will be joining you?",
            options: ["1-4 Guests", "5-8 Guests", "9+ Guests"],
          },
        ]);
      } else if (stage === "guests") {
        setStage("recommendation");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Perfect. Based on your preferences, I highly recommend this stunning property:",
          },
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: (
              <div className="mt-4 w-full">
                <VillaCard {...recommendedVilla} className="w-[280px]" />
              </div>
            ),
          },
          {
            id: (Date.now() + 2).toString(),
            role: "bot",
            content: "Would you like me to check availability for your dates?",
            options: ["Yes, please", "Start over"],
          },
        ]);
      } else if (stage === "recommendation" && option === "Start over") {
        setStage("greeting");
        setMessages([
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Let's start over. Where are you looking to travel?",
            options: ["Lonavala", "Alibaug", "Karjat", "Anywhere"],
          },
        ]);
      } else if (stage === "recommendation" && option === "Yes, please") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "I am connecting you with our booking specialists. They will reach out to you shortly.",
          }
        ]);
      }
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-16 h-16 bg-[#FFCC00] hover:bg-[#FFD700] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,204,0,0.4)] transition-all duration-300 group overflow-hidden border-2 border-white/20"
          >
            <img 
              src="/images/chatbot.png" 
              alt="Willa Assistant" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-6rem)] bg-charcoal/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/40 bg-white/5 flex items-center justify-center shrink-0">
                  <img src="/images/chatbot.png" alt="Willa Assistant" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-heading text-lg leading-tight">Willa Assistant</h3>
                  <p className="text-[10px] text-gold tracking-widest uppercase font-bold">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.role === "bot" && (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0 flex items-center justify-center mb-1">
                        <img src="/images/chatbot.png" alt="Willa Assistant" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gold text-black rounded-br-sm font-medium"
                            : "bg-white/10 text-white rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      
                      {/* Options */}
                      {msg.options && (
                        <div className="flex flex-col gap-2 mt-2">
                          {msg.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(opt, msg.id)}
                              className="text-left px-4 py-2 rounded-xl border border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors text-xs font-semibold uppercase tracking-wider"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex-shrink-0 flex items-center justify-center mb-1">
                        <User size={12} className="text-gold" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Mocked for now since it's a guided flow) */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select an option above..."
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none cursor-not-allowed"
                />
                <button
                  disabled
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
