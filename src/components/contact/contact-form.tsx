"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Villa Booking Inquiry");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setError("Please fill in all the required fields so we can reach you.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1. Submit to local Database first so the inquiry is safely registered in Admin Dashboard
      const dbRes = await submitInquiry({
        name,
        email,
        phone,
        message: `[Inquiry Type: ${inquiryType}] ${message}`,
        type: inquiryType === "Partner with Us" ? "OWNER" : "GUEST",
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
            Name: name,
            Email: email,
            Phone: phone,
            "Inquiry Type": inquiryType,
            Message: message,
            _subject: `🏰 Stay Willas - New ${inquiryType} from ${name}`,
            _template: "box"
          })
        });
      } catch (emailErr) {
        console.warn("Best effort FormSubmit notification failed:", emailErr);
      }

      // 3. Mark as success since DB write succeeded
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setError("Something went wrong. Please try again or reach out directly via phone.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-bg-primary border border-accent-secondary/25 rounded-[40px] p-12 text-center shadow-[0_10px_40px_rgba(44,31,14,0.08)] flex flex-col items-center justify-center min-h-[450px] animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-8 animate-bounce">
          <CheckCircle2 size={44} />
        </div>
        <h3 className="text-3xl font-heading text-text-primary mb-4 italic">Message Sent Beautifully</h3>
        <p className="text-text-primary/55 text-sm max-w-sm leading-relaxed mb-8">
          Thank you for reaching out to Stay Willas. Our dedicated concierge team is already reviewing your request and will contact you within 24 hours.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          className="border border-accent-primary/30 text-accent-primary hover:bg-accent-primary hover:text-white rounded-full px-8 py-4 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold bg-transparent"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary border border-border-subtle rounded-[40px] p-12 shadow-[0_10px_40px_rgba(44,31,14,0.08)]">
      <h3 className="text-3xl font-heading text-text-primary mb-10">Send A Message</h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Your Name *</label>
            <input 
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Email Address *</label>
            <input 
              type="email" required value={email}
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
              type="tel" required value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30" 
              placeholder="+91 98765 43210" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">What are you looking for? *</label>
            <div className="relative">
              <select 
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all appearance-none text-text-primary text-sm"
              >
                <option className="bg-bg-primary text-text-primary">Villa Booking Inquiry</option>
                <option className="bg-bg-primary text-text-primary">Partner with Us</option>
                <option className="bg-bg-primary text-text-primary">Corporate Offsite</option>
                <option className="bg-bg-primary text-text-primary">Other Inquiry</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-primary/40">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-text-primary/40 ml-2">Your Message *</label>
          <textarea 
            rows={5} required value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-border-subtle rounded-2xl px-6 py-4 focus:border-accent-primary outline-none transition-all resize-none text-text-primary text-sm placeholder:text-text-primary/30" 
            placeholder="How can we help you today?"
          ></textarea>
        </div>

        {error && (
          <p className="text-red-500 text-xs ml-2 animate-pulse">{error}</p>
        )}

        <Button 
          type="submit" disabled={loading}
          className="w-full bg-accent-primary hover:bg-accent-secondary text-white rounded-full py-7 text-lg font-bold tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(27,53,100,0.25)]"
        >
          {loading ? (
            <>SUBMITTING REQUEST... <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>SUBMIT INQUIRY <ArrowRight size={20} /></>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
