"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Loader2, Home } from "lucide-react";

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
      const res = await fetch("https://formsubmit.co/ajax/staywillas@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Phone: phone,
          Location: location,
          Message: message,
          _subject: `🏰 Stay Willas - New Property Partnership Inquiry from ${name} (${location})`,
          _template: "box"
        })
      });

      const data = await res.json();
      if (data.success === "true" || res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setLocation("");
        setMessage("");
      } else {
        throw new Error("FormSubmit response failed");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again or connect directly with our partnership office.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-bg-primary border border-accent-secondary/25 rounded-[40px] p-12 text-center shadow-[0_10px_40px_rgba(44,31,14,0.08)] flex flex-col items-center justify-center min-h-[450px] animate-fade-in max-w-3xl mx-auto my-12">
        <div className="w-20 h-20 rounded-full bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-8 animate-bounce">
          <CheckCircle2 size={44} />
        </div>
        <h3 className="text-3xl font-heading text-text-primary mb-4 italic">Partnership Inquiry Submitted</h3>
        <p className="text-text-primary/55 text-sm max-w-md leading-relaxed mb-8 mx-auto">
          Thank you for sharing your home with us! Our partnership acquisitions specialist will review your property's details and reach out within 24 hours to arrange an in-person viewing of your estate.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          className="border border-accent-primary/30 text-accent-primary hover:bg-accent-primary hover:text-white rounded-full px-8 py-4 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold bg-transparent"
        >
          Submit Another Property
        </Button>
      </div>
    );
  }

  return (
    <div id="partner-form" className="bg-bg-primary border border-border-subtle rounded-[40px] p-12 shadow-[0_10px_40px_rgba(44,31,14,0.08)] max-w-4xl mx-auto my-12 scroll-mt-32">
      <div className="text-center mb-12">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center mx-auto mb-4">
          <Home size={24} />
        </div>
        <h3 className="text-3xl font-heading text-text-primary italic">Register Your Property</h3>
        <p className="text-text-primary/40 text-sm mt-2">Provide your estate details and our property team will get back to you shortly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Full Name *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Email Address *</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="john@example.com" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Phone Number *</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="+91 98765 43210" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Villa Location (City/Region) *</label>
            <input 
              type="text" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="e.g., Lonavala, Alibaug, Karjat" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Tell Us About Your Property *</label>
          <textarea 
            rows={5} 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all resize-none text-text-primary text-sm placeholder:text-text-primary/30" 
            placeholder="Describe your villa (number of bedrooms, special highlights like valley views, infinity pool, etc.)"
          ></textarea>
        </div>

        {error && (
          <p className="text-red-500 text-xs ml-2 animate-pulse">{error}</p>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-accent-primary hover:bg-accent-secondary text-white rounded-full py-7 text-lg font-bold tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(27,53,100,0.25)]"
        >
          {loading ? (
            <>SUBMITTING DETAILS... <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>SUBMIT PARTNERSHIP INQUIRY <ArrowRight size={20} /></>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PartnerForm;
