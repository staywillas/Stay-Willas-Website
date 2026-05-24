"use client";

/**
 * use-auth.ts — Thin wrapper around Clerk's useUser/useAuth hooks.
 * Provides the same interface the rest of the app expects:
 *   { user, isSignedIn, isLoading }
 */

import { useUser } from "@clerk/nextjs";

export interface UserSession {
  email: string;
  role: "admin" | "partner" | "guest";
  name: string;
  id: string;
}

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();

  const mappedUser: UserSession | null = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? user.firstName ?? "Guest",
        role: "guest", // Guests via Clerk are always "guest"
      }
    : null;

  return {
    user: mappedUser,
    isSignedIn: isSignedIn ?? false,
    isLoading: !isLoaded,
  };
}
