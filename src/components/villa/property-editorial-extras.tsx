"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import styles from "./property-editorial.module.css";

const FoodMenuDialog = dynamic(() => import("./food-menu-dialog"), {
  ssr: false,
  loading: () => (
    <p role="status" className={styles.galleryLoading}>
      Opening dining menus…
    </p>
  ),
});
const ReviewSection = dynamic(() => import("./review-section"), {
  loading: () => <p role="status">Loading guest reviews…</p>,
});
type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export default function PropertyEditorialExtras({
  kind,
  villaId = "",
  reviews = [],
}: {
  kind: "menus" | "reviews";
  villaId?: string;
  reviews?: Review[];
}) {
  const [open, setOpen] = useState(false);
  if (kind === "menus")
    return (
      <>
        <button
          type="button"
          className={styles.textLink}
          onClick={() => setOpen(true)}
        >
          View dining menus <ArrowUpRight size={16} />
        </button>
        {open && <FoodMenuDialog onClose={() => setOpen(false)} />}
      </>
    );
  return (
    <div className={styles.reviewMore}>
      <button
        type="button"
        className={styles.textLink}
        aria-expanded={open}
        aria-controls="property-full-reviews"
        onClick={() => setOpen((value) => !value)}
      >
        {open
          ? "Close full reviews"
          : `Read all ${reviews.length} reviews or share your stay`}
        <ChevronDown size={16} />
      </button>
      {open && (
        <div id="property-full-reviews" className={styles.fullReviews}>
          <ReviewSection villaId={villaId} initialReviews={reviews} embedded />
        </div>
      )}
    </div>
  );
}
