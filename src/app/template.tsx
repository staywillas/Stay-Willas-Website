import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  // Paint the server-rendered page immediately; a full-page blur delays LCP.
  return <div>{children}</div>;
}
