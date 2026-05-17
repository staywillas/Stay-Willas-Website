"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/app/actions/review";
import { useUser, SignInButton } from "@clerk/nextjs";
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
  const { user, isSignedIn } = useUser();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !user) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        villaId,
        userId: user.id,
        userName: user.fullName || "Anonymous Guest",
        rating,
        comment,
      });

      // Update UI instantly before DB finishes saving, makes the site feel super snappy!
      const newReview = {
        id: Math.random().toString(),
        userName: user.fullName || "Anonymous Guest",
        rating,
        comment,
        createdAt: new Date(),
      };
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 border-t border-white/5">
      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* The list of guest reviews, grouped on the left side of the screen */}
        <div className="lg:col-span-7 flex-grow">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-heading italic">Guest <span className="text-gold not-italic font-bold">Reviews</span></h2>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/40">
              {reviews.length} Feedbacks
            </div>
          </div>

          <div className="space-y-12">
            {reviews.length === 0 ? (
              <p className="text-white/40 italic">No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-white tracking-wide">{review.userName}</h4>
                      <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                        {format(new Date(review.createdAt), "MMMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < review.rating ? "fill-gold text-gold" : "text-white/10"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm italic pr-12">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* The form to submit a review - sticky on scroll so it stays in view while reading */}
        <div className="lg:w-1/3">
          <div className="glass-dark border border-white/10 rounded-[32px] p-10 sticky top-32">
            <h3 className="text-2xl font-heading mb-8">Share Your <span className="italic text-gold">Story</span></h3>
            
            {isSignedIn ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-4">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star 
                          size={24} 
                          className={star <= rating ? "fill-gold text-gold" : "text-white/10"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block">Your Experience</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Describe your stay..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-all text-sm resize-none"
                  />
                </div>

                <Button 
                  disabled={isSubmitting || !comment}
                  className="w-full bg-gold hover:bg-gold/80 text-charcoal rounded-full py-6 font-bold tracking-widest flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={16} /> SUBMIT REVIEW</>}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto text-white/10 mb-4" size={48} />
                <p className="text-white/40 text-sm mb-8 italic">Please sign in to leave a review of your stay.</p>
                <SignInButton mode="modal">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full py-6 font-bold tracking-widest">
                    SIGN IN TO REVIEW
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReviewSection;
