import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — نقطة",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased" style={{ fontFamily: "Amiri, Tajawal, system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            padding: "2rem",
            background: "#F8FAFC",
            color: "#0F172A",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#94A3B8",
            }}
          >
            404
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>الصفحة غير موجودة</h1>
          <p style={{ color: "#475569", margin: 0, maxWidth: "28rem" }}>
            الرابط الذي فتحته غير صالح أو نُقل إلى صفحة أخرى.
          </p>
          <a
            href="/"
            style={{
              marginTop: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.75rem",
              borderRadius: "12px",
              background: "#059669",
              color: "#FFFFFF",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            العودة إلى الرئيسية
          </a>
          <p style={{ fontSize: "0.875rem" }}>
            <a href="/en/" lang="en" dir="ltr" style={{ color: "#059669", textDecoration: "underline" }}>
              English version
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
