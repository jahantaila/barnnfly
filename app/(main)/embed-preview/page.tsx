import Image from "next/image";
import Script from "next/script";

export const metadata = {
  title: "Embed preview · Bark & Fly × Derby Digital",
  description: "Preview how the Bark & Fly survey looks embedded on WordPress.",
};

// Standalone page that simulates a WordPress post hosting the embed.
// Open /embed-preview to see exactly what a partner would see on their site.
export default function EmbedPreview() {
  const snippet = `<!-- Bark & Fly brand survey embed (paste into a WordPress "Custom HTML" block) -->
<div id="barknfly-survey"></div>
<script src="https://YOUR-DEPLOY-URL/embed.js" defer></script>`;

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px", fontFamily: "Georgia, serif", color: "#1a1a1a", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, color: "#9aa0ab", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.14em" }}>
        <Image src="/derby-logo.svg" alt="" width={80} height={24} style={{ height: "auto" }} />
        <span>· Sample WordPress host page</span>
      </div>
      <h1 style={{ fontSize: 44, fontFamily: "Georgia, serif", lineHeight: 1.15, margin: "0 0 14px" }}>
        Shape the brand of Bark &amp; Fly
      </h1>
      <p style={{ color: "#4a4a4a", fontSize: 18, lineHeight: 1.6, margin: 0 }}>
        We&apos;re partnering with Derby Digital to build Bark &amp; Fly into a
        category-defining pet resort. Share your vision below — the survey
        takes about 5 minutes, and every answer shapes the logo, palette, and
        positioning we design for you.
      </p>

      <hr style={{ margin: "36px 0", border: 0, borderTop: "1px solid #e5e7eb" }} />

      {/* Begin WordPress "Custom HTML" block equivalent */}
      <div id="barknfly-survey" />
      <Script src="/embed.js" strategy="afterInteractive" />
      {/* End Custom HTML block */}

      <hr style={{ margin: "36px 0", border: 0, borderTop: "1px solid #e5e7eb" }} />

      <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Paste-in snippet for WordPress</h2>
      <p style={{ fontSize: 14, color: "#4a4a4a", margin: "0 0 12px" }}>
        Replace <code>YOUR-DEPLOY-URL</code> with wherever this app is hosted
        (Vercel, Netlify, your own server, etc.):
      </p>
      <pre
        style={{
          background: "#0a0e27",
          color: "#e9eefc",
          padding: "18px 20px",
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.6,
          overflowX: "auto",
        }}
      >
        <code>{snippet}</code>
      </pre>
    </main>
  );
}
