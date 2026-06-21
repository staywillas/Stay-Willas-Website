"use client";

import React, { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { submitReview } from "@/app/actions/review";
import { Star, MessageSquare, Send, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  villas: Array<{ id: string; name: string }>;
}

export default function ReviewForm({ villas }: ReviewFormProps) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  
  const [selectedVilla, setSelectedVilla] = useState(villas[0]?.id || "");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) {
      setError("Please sign in to submit your review.");
      return;
    }

    if (!selectedVilla) {
      setError("Please select a villa.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const name = user.fullName || user.username || "Verified Guest";
      const result = await submitReview({
        villaId: selectedVilla,
        userId: user.id,
        userName: name,
        rating,
        comment: comment.trim(),
      });

      if (result.success) {
        setSuccess(true);
        setComment("");
        setRating(5);
        router.refresh(); // Refresh page to pull new review from server
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="glass-premium rounded-[2rem] border border-[#DAA520]/20 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-xl">
        <div className="w-16 h-16 rounded-full bg-[#DAA520]/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles size={28} className="text-[#DAA520]" />
        </div>
        <h3 className="text-2xl font-heading text-[#1B3564] mb-3">Share Your Stay Willas Story</h3>
        <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Stayed with us recently? We would love to hear about your experience. Sign in to write a review and share your memories.
        </p>
        <SignInButton mode="modal">
          <button className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] font-black text-xs tracking-widest uppercase rounded-full px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
            Sign In to Review
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(27,53,100,0.06)] p-8 md:p-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-3.5 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#1B3564]/5 flex items-center justify-center">
          <MessageSquare size={22} className="text-[#DAA520]" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-heading text-[#1B3564] font-bold">Write a Guest Review</h3>
          <p className="text-xs text-slate-500 font-medium">Signed in as {user.fullName || user.username}</p>
        </div>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle size={32} />
          </div>
          <h4 className="text-lg font-bold text-[#1B3564] mb-2">Review Submitted!</h4>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Thank you for sharing your experience. Your review has been added to our guest stories.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="text-xs font-bold text-[#2563EB] hover:underline"
          >
            Submit another review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-xs font-medium">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Select Villa */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest pl-1">
              Which Villa did you stay in?
            </label>
            <select
              value={selectedVilla}
              onChange={(e) => setSelectedVilla(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-semibold text-[#1B3564] outline-none focus:border-[#DAA520] transition-colors"
            >
              {villas.map((villa) => (
                <option key={villa.id} value={villa.id}>
                  {villa.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest pl-1">
              Your Rating
            </label>
            <div className="flex items-center gap-1.5 pl-1 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = star <= (hoverRating !== null ? hoverRating : rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="focus:outline-none transition-transform active:scale-95"
                  >
                    <Star
                      size={28}
                      className={`stroke-[1.5] transition-colors ${
                        isSelected 
                          ? "fill-[#DAA520] text-[#DAA520]" 
                          : "text-slate-300 hover:text-[#DAA520]/75"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review text */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest pl-1">
              Your Experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your stay, the service, the food, and the villa vibes..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-[#DAA520] transition-colors resize-none placeholder-slate-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-fit bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white font-bold rounded-full px-8 py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer border-none shrink-0 self-start mt-2"
          >
            <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
            <Send size={12} className="stroke-[2.5]" />
          </button>
        </form>
      )}
    </div>
  );
}
