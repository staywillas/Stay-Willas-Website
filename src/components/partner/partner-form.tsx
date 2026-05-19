"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Loader2, Home } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";

const PartnerForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !location || !message) {
      setError("Please fill in all details about your beautiful property so we can evaluate it.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await submitInquiry({
        name,
        email,
        phone,
        message: `[Property Location: ${location}] ${message}`,
        type: "OWNER",
      });

      if (res.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setLocation("");
        setMessage("");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again or connect directly with our partnership office.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-dark border border-gold/30 rounded-[40px] p-12 text-center shadow-2xl flex flex-col items-center justify-center min-h-[450px] animate-fade-in max-w-3xl mx-auto my-12">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-8 animate-bounce">
          <CheckCircle2 size={44} />
        </div>
        <h3 className="text-3xl font-heading text-white mb-4 italic">Partnership Inquiry Submitted</h3>
        <p className="text-white/60 text-sm max-w-md leading-relaxed mb-8 mx-auto">
          Thank you for sharing your home with us! Our partnership acquisitions specialist will review your property's details and reach out within 24 hours to arrange an in-person viewing of your estate.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          className="border border-gold/30 text-gold hover:bg-gold hover:text-charcoal rounded-full px-8 py-4 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold"
        >
          Submit Another Property
        </Button>
      </div>
    );
  }

  return (
    <div id="partner-form" className="glass-dark border border-white/10 rounded-[40px] p-12 shadow-2xl max-w-4xl mx-auto my-12 scroll-mt-32">
      <div className="text-center mb-12">
        <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
          <Home size={24} />
        </div>
        <h3 className="text-3xl font-heading text-white italic">Register Your Property</h3>
        <p className="text-white/40 text-sm mt-2">Provide your estate details and our property team will get back to you shortly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Full Name *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-white text-sm" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Email Address *</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-white text-sm" 
              placeholder="john@example.com" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Phone Number *</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-white text-sm" 
              placeholder="+91 96190 42310" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Villa Location (City/Region) *</label>
            <input 
              type="text" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-white text-sm" 
              placeholder="e.g., Lonavala, Alibaug, Karjat" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Tell Us About Your Property *</label>
          <textarea 
            rows={5} 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all resize-none text-white text-sm" 
            placeholder="Describe your villa (number of bedrooms, special highlights like valley views, infinity pool, etc.)"
          ></textarea>
        </div>

        {error && (
          <p className="text-red-400 text-xs ml-2 animate-pulse">{error}</p>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gold hover:bg-gold/80 text-charcoal rounded-full py-7 text-lg font-bold tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              SUBMITTING DETAILS... <Loader2 className="animate-spin" size={20} />
            </>
          ) : (
            <>
              SUBMIT PARTNERSHIP INQUIRY <ArrowRight size={20} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PartnerForm;
