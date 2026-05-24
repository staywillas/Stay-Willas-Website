"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/app/actions/review";
import { useAuth } from "@/lib/use-auth";
import { format } from "date-fns";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewSectionProps {
  villaId: string;
  initialReviews: Review[];
}

const ReviewSection = ({ villaId, initialReviews }: ReviewSectionProps) => {
  const { user, isSignedIn } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    const activeUserName = isSignedIn && user 
      ? (user.name || "Anonymous Guest") 
      : (guestName.trim() || "Guest Traveler");
      
    const activeUserId = isSignedIn && user 
      ? user.id 
      : "guest-" + Math.random().toString(36).substring(2, 9);

    setIsSubmitting(true);
    try {
      await submitReview({
        villaId,
        userId: activeUserId,
        userName: activeUserName,
        rating,
        comment,
      });

      // Update UI instantly before DB finishes saving, makes the site feel super snappy!
      const newReview = {
        id: Math.random().toString(),
        userName: activeUserName,
        rating,
        comment,
        createdAt: new Date(),
      };
      setReviews([newReview, ...reviews]);
      setComment("");
      setGuestName("");
      setRating(5);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 border-t border-border-subtle/60">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* The list of guest reviews, grouped on the left side of the screen */}
        <div className="lg:w-2/3 flex-grow">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-heading text-text-primary">
              Guest <span className="text-accent-primary italic">Reviews</span>
            </h2>
            <div className="px-3 py-1 bg-white border border-border-subtle rounded-full text-[10px] font-bold tracking-widest uppercase text-accent-primary/70 shadow-sm">
              {reviews.length} Feedbacks
            </div>
          </div>

          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-text-primary/50 italic text-sm">No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="group border-b border-border-subtle/40 pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-text-primary tracking-wide">{review.userName}</h4>
                      <p className="text-[10px] text-text-primary/40 uppercase tracking-[0.2em] mt-0.5">
                        {format(new Date(review.createdAt), "MMMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-0.5 bg-white/40 border border-border-subtle/30 px-2.5 py-1.5 rounded-full shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < review.rating ? "fill-accent-secondary text-accent-secondary" : "text-[#E2E8F0]"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-primary/75 leading-relaxed text-sm italic pr-6 md:pr-12">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* The form to submit a review - sticky on scroll so it stays in view while reading */}
        <div className="lg:w-1/3 w-full">
          <div className="glass-dark border border-border-subtle/50 rounded-[32px] p-6 sm:p-8 text-brand-navy sticky top-32 shadow-xl shadow-[#1B3564]/5">
            <h3 className="text-2xl font-heading mb-8 text-brand-navy">
              Share Your <span className="italic text-accent-primary">Story</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isSignedIn && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-navy/60 block font-bold">Your Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-white/60 border border-border-subtle rounded-2xl px-5 py-3 outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all text-sm text-brand-navy placeholder:text-brand-navy/35"
                    required
                  />
                </div>
              )}

              {isSignedIn && user && (
                <div className="text-[10px] text-brand-navy/60 uppercase tracking-widest block font-bold">
                  Posting as <span className="text-accent-primary font-black">{user.name || "Anonymous Guest"}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-brand-navy/60 block mb-3 font-bold">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star 
                        size={24} 
                        className={star <= rating ? "fill-accent-secondary text-accent-secondary" : "text-brand-navy/20 hover:text-brand-navy/40"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-navy/60 block font-bold">Your Experience</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Describe your stay..."
                  className="w-full bg-white/60 border border-border-subtle rounded-2xl px-5 py-3 outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all text-sm text-brand-navy placeholder:text-brand-navy/35 resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !comment || (!isSignedIn && !guestName.trim())}
                className="w-full bg-accent-primary hover:bg-accent-primary/95 disabled:bg-accent-primary/40 disabled:text-white/40 text-white rounded-full py-4 font-bold tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md shadow-accent-primary/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Send size={14} /> 
                    SUBMIT REVIEW
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReviewSection;
