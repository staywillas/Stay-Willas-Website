"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F2EA",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#1A1A1A",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "rgba(218, 165, 32, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 28,
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: 24,
              color: "#1B3564",
              fontWeight: 600,
              letterSpacing: "0.025em",
              margin: "0 0 12px",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "#4A4A4A",
              fontSize: 14,
              lineHeight: 1.6,
              margin: "0 0 32px",
            }}
          >
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#1B3564",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 9999,
              padding: "12px 32px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.05em",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(27, 53, 100, 0.2)",
            }}
          >
            Try Again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 10,
                color: "#4A4A4A",
                opacity: 0.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
