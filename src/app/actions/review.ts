"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

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
      where: { villaId },
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    return [];
  }
}
