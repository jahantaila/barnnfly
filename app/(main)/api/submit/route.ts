import { NextResponse } from "next/server";
import { Resend } from "resend";
import { LOGO_CONCEPTS, type SurveyData } from "@/lib/survey-config";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as SurveyData;
    const receivedAt = new Date().toISOString();

    // Always log to server console — useful in Vercel logs for debugging.
    console.log(
      "[barknfly:submit]",
      JSON.stringify({ receivedAt, ...data }, null, 2)
    );

    // Email via Resend if configured. Missing env vars = submission still
    // accepted (returns ok) but warns in logs so we can fix in prod.
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.SUBMIT_TO_EMAIL;
    const from =
      process.env.SUBMIT_FROM_EMAIL ??
      "Bark & Fly Survey <onboarding@resend.dev>";

    if (!apiKey || !to) {
      console.warn(
        "[submit] Resend not configured — set RESEND_API_KEY and SUBMIT_TO_EMAIL env vars to receive email"
      );
      return NextResponse.json({ ok: true, emailed: false });
    }

    const resend = new Resend(apiKey);
    const subject = buildSubject(data);
    const { html, text } = buildEmailBody(data, receivedAt);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text,
      replyTo: data.email ? data.email : undefined,
    });

    if (error) {
      console.error("[submit] Resend error", error);
      // Still return ok — we don't want the user to retry submission and
      // double-log. Email failure is our problem to surface in logs.
      return NextResponse.json({ ok: true, emailed: false });
    }

    return NextResponse.json({ ok: true, emailed: true });
  } catch (err) {
    console.error("[submit] error", err);
    return NextResponse.json(
      { ok: false, error: "invalid payload" },
      { status: 400 }
    );
  }
}

function buildSubject(d: SurveyData) {
  const name = d.fullName?.trim() || "Someone";
  const fav = LOGO_CONCEPTS.find((c) => c.id === d.favoriteConceptId);
  const tail = fav ? ` · favorite: ${fav.label}` : "";
  return `🐶 New Bark & Fly logo vote from ${name}${tail}`;
}

function buildEmailBody(d: SurveyData, receivedAt: string) {
  const name = d.fullName?.trim() || "—";
  const email = d.email?.trim() || "(not provided)";
  const relationship = d.relationship || "—";
  const when = new Date(receivedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const favoriteConcept = LOGO_CONCEPTS.find(
    (c) => c.id === d.favoriteConceptId
  );

  const ratingRows = LOGO_CONCEPTS.map((c) => {
    const r = d.ratings[c.id];
    const stars = r?.stars ?? 0;
    const starStr =
      stars > 0 ? "★".repeat(stars) + "☆".repeat(5 - stars) : "(not rated)";
    const isFav = favoriteConcept?.id === c.id;
    return {
      ...c,
      stars,
      starStr,
      note: r?.note ?? "",
      preferredVariant: r?.preferredVariant ?? "",
      isFav,
    };
  });

  // Plain text fallback
  const text = [
    `New Bark & Fly logo vote`,
    `Received: ${when}`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Relationship: ${relationship}`,
    ``,
    `Vibes: ${d.vibes.join(", ") || "—"}`,
    d.nameSuggestion ? `Name idea: ${d.nameSuggestion}` : "",
    ``,
    `Overall favorite: ${favoriteConcept?.label ?? "(not picked)"}`,
    ``,
    `Ratings:`,
    ...ratingRows.map(
      (r) =>
        `  ${r.label}${r.isFav ? " ← FAVORITE" : ""}\n    ${r.starStr}${
          r.preferredVariant ? `\n    variant: ${r.preferredVariant}` : ""
        }${r.note ? `\n    note: ${r.note}` : ""}`
    ),
    d.anythingElse ? `\nAdditional notes:\n${d.anythingElse}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // HTML email
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0e27;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
    <div style="background:#fff;border:1px solid #e4e7f2;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px -30px rgba(31,77,255,0.25);">

      <div style="background:#0a0e27;color:#fff;padding:28px 32px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#8c9cff;margin-bottom:6px;">
          New submission · Bark &amp; Fly Logo Vote
        </div>
        <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;">
          ${escapeHtml(name)} just voted.
        </div>
      </div>

      <div style="padding:24px 32px;">
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Relationship", relationship)}
        ${row("Received", when)}
        ${row("Vibes", d.vibes.length ? d.vibes.join(", ") : "—")}
        ${
          d.nameSuggestion
            ? row("Name idea", d.nameSuggestion)
            : ""
        }
        ${row(
          "Overall favorite",
          favoriteConcept
            ? `<strong style="color:#1f4dff;">★ ${escapeHtml(favoriteConcept.label)}</strong>`
            : "<em>(not picked)</em>",
          true
        )}
      </div>

      <div style="padding:8px 32px 28px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;margin-bottom:12px;">
          Ratings
        </div>
        ${ratingRows
          .map(
            (r) => `
          <div style="border:1px solid ${r.isFav ? "#1f4dff" : "#e4e7f2"};background:${r.isFav ? "#e8edff" : "#fff"};border-radius:12px;padding:14px 16px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;">
              <div style="font-weight:700;font-size:14px;">
                ${escapeHtml(r.label)}${r.isFav ? ' <span style="color:#1f4dff;">· your favorite</span>' : ""}
              </div>
              <div style="font-size:16px;color:#1f4dff;white-space:nowrap;">
                ${r.stars > 0 ? r.starStr : '<span style="color:#9ca3af;font-size:12px;">not rated</span>'}
              </div>
            </div>
            ${
              r.preferredVariant
                ? `<div style="margin-top:8px;font-size:13px;color:#0a0e27;"><strong>Preferred version:</strong> ${escapeHtml(r.preferredVariant)}</div>`
                : ""
            }
            ${
              r.note
                ? `<div style="margin-top:6px;font-size:13px;color:#374151;line-height:1.5;">${escapeHtml(r.note)}</div>`
                : ""
            }
          </div>`
          )
          .join("")}
      </div>

      ${
        d.anythingElse
          ? `<div style="padding:0 32px 28px;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;margin-bottom:8px;">
                Additional notes
              </div>
              <div style="background:#f5f6fb;border:1px solid #e4e7f2;border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(
                d.anythingElse
              )}</div>
            </div>`
          : ""
      }

      <div style="background:#f5f6fb;padding:16px 32px;border-top:1px solid #e4e7f2;font-size:11px;color:#6b7280;text-align:center;letter-spacing:0.1em;">
        A Derby Digital project · <a href="https://barknfly.vercel.app" style="color:#1f4dff;text-decoration:none;">barknfly.vercel.app</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  return { html, text };
}

function row(label: string, value: string, allowHtml = false) {
  const safe = allowHtml ? value : escapeHtml(value);
  return `<div style="display:flex;gap:16px;padding:8px 0;border-bottom:1px solid #f0f2f7;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;width:130px;flex-shrink:0;padding-top:2px;">${escapeHtml(label)}</div>
    <div style="font-size:14px;flex:1;">${safe}</div>
  </div>`;
}

function escapeHtml(s: string) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
