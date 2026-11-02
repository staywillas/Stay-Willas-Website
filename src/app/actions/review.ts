"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// These records were inserted by the demo seed and have not been verified.
// Keep them in the database for review, but exclude them from public reviews and schema.
const UNVERIFIED_SEED_REVIEW_USERS = [
  "guest_rohan_mehta", "guest_vikram_singhania", "guest_aditi_deshmukh",
  "guest_sameer_kulkarni", "guest_anand_joshi", "guest_rahul_verma",
  "guest_deepak_sharma", "guest_pooja_hegde", "guest_kunal_patel",
  "guest_siddharth_rao", "guest_tanvi_kapoor", "guest_harsh_patil",
  "guest_neelam_shah",
];

export async function submitReview(formData: {
  villaId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}) {
  try {
    await prisma.review.create({
      data: {
        villaId: formData.villaId,
        userId: formData.userId,
        userName: formData.userName,
        rating: formData.rating,
        comment: formData.comment,
      },
    });

    revalidatePath(`/villa/${formData.villaId}`);
    return { success: true };
  } catch (error) {
    console.error("Review Submission Error:", error);
    throw new Error("Failed to submit review");
  }
}

export async function getReviews(villaId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { villaId, userId: { notIn: UNVERIFIED_SEED_REVIEW_USERS } },
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    return [];
  }
}
