"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Loader2, Phone } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";

const ContactForm = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Please enter your phone number so we can reach you.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1. Submit to local Database first so the inquiry is safely registered in Admin Dashboard
      const dbRes = await submitInquiry({
        name: "Phone Callback Request",
        email: "no-email@staywillas.com",
        phone,
        message: "Customer requested a quick callback regarding Stay Willas private pool villas.",
        type: "GUEST",
      });

      if (!dbRes.success) {
        throw new Error("Local DB submission failed");
      }

      // 2. Best effort email notification via FormSubmit
      try {
        await fetch("https://formsubmit.co/ajax/staywillas@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Phone: phone,
            Message: "Customer requested a phone callback from the contact page.",
            _subject: `🏰 Stay Willas - New Callback Request from ${phone}`,
            _template: "box"
          })
        });
      } catch (emailErr) {
        console.warn("Best effort FormSubmit notification failed:", emailErr);
      }

      // 3. Mark as success since DB write succeeded
      setSuccess(true);
      setPhone("");
    } catch (err: any) {
      setError("Something went wrong. Please try again or reach out directly via phone.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-bg-primary border border-accent-secondary/25 rounded-[40px] p-12 text-center shadow-[0_10px_40px_rgba(44,31,14,0.08)] flex flex-col items-center justify-center min-h-[350px] animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-8 animate-bounce">
          <CheckCircle2 size={44} />
        </div>
        <h3 className="text-3xl font-heading text-text-primary mb-4 italic">Callback Requested</h3>
        <p className="text-text-primary/55 text-sm max-w-sm leading-relaxed mb-8">
          Thank you. Our concierge team is already reviewing your request and will call you back shortly.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          className="border border-accent-primary/30 text-accent-primary hover:bg-accent-primary hover:text-white rounded-full px-8 py-4 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold bg-transparent cursor-pointer"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary border border-border-subtle rounded-[40px] p-12 shadow-[0_10px_40px_rgba(44,31,14,0.08)] max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-heading text-text-primary mb-2">Request a Callback</h3>
        <p className="text-xs text-text-primary/55 max-w-md mx-auto">
          Enter your phone number below. Our team will contact you within 15 minutes to help plan your getaway.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2 block text-left">Phone Number *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6 text-text-primary/40">
              <Phone size={16} />
            </span>
            <input 
              type="tel" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl pl-14 pr-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="+91 98765 43210" 
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-xs ml-2 text-left animate-pulse">{error}</p>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-accent-primary hover:bg-accent-secondary text-white rounded-full py-7 text-lg font-bold tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(27,53,100,0.25)]"
        >
          {loading ? (
            <>REQUESTING CALLBACK... <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>REQUEST A CALL <ArrowRight size={20} /></>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
