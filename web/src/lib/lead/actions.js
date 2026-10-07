"use server";

import { createItem } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import { FIELDS, validate } from "@/lib/lead/fields";
import { describeAttribution } from "@/lib/lead/attribution";

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "referrer",
  "landing_page",
  "captured_at",
];

function cleanAttribution(raw) {
  if (!raw || typeof raw !== "object") return {};
  return Object.fromEntries(
    ATTRIBUTION_KEYS.filter((key) => typeof raw[key] === "string" && raw[key]).map((key) => [key, raw[key].slice(0, 500)])
  );
}

async function sendToWebhook(payload) {
  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) return true;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) console.error(`[lead] webhook responded ${res.status}: ${await res.text().catch(() => "")}`);
  return res.ok;
}

async function saveToCms(payload) {
  if (process.env.LEAD_STORE_IN_CMS === "false") return true;
  await apiClient().request(
    createItem("leads", {
      name: payload.answers.name,
      email: payload.answers.email,
      company: payload.answers.company || null,
      topic: payload.answers.topic || null,
      message: payload.answers.message || null,
      answers: payload.answers,
      attribution: payload.attribution,
      source: payload.source,
    })
  );
  return true;
}

export async function submitLead({ answers, attribution }) {
  const cleaned = Object.fromEntries(
    FIELDS.map((f) => {
      const value = answers?.[f.id];
      return [f.id, typeof value === "string" ? value.trim() : value];
    })
  );
  if (FIELDS.some((f) => validate(f, cleaned[f.id]))) return { ok: false };

  const safeAttribution = cleanAttribution(attribution);
  const payload = { answers: cleaned, attribution: safeAttribution, source: describeAttribution(safeAttribution) };

  try {
    const [stored, forwarded] = await Promise.all([saveToCms(payload), sendToWebhook(payload)]);
    return { ok: stored && forwarded };
  } catch (error) {
    console.error("[lead] submission failed", error?.errors?.[0]?.message ?? error);
    return { ok: false };
  }
}
