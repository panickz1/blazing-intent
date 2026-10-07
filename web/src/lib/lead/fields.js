export const FIELDS = [
  { id: "name", label: "Name", type: "text", placeholder: "Your name", autoComplete: "name", half: true },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email", half: true },
  { id: "company", label: "Company", type: "text", placeholder: "Optional", autoComplete: "organization", optional: true },
  { id: "topic", label: "What is it about?", type: "segments", options: ["Sales", "Support", "Partnership", "Other"] },
  { id: "message", label: "Message", type: "textarea", placeholder: "How can we help?" },
];

export function isAnswered(value) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value?.trim?.());
}

export function validate(field, value) {
  if (!isAnswered(value)) return field.optional ? "" : "Required.";
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "That doesn't look like an email address.";
  }
  if (field.type === "url" && !/^\S+\.\S+$/.test(value.trim())) {
    return "That doesn't look like a link.";
  }
  if (field.options && !field.options.includes(value)) return "Pick one of the options.";
  if (typeof value === "string" && value.length > 5000) return "Keep it under 5,000 characters.";
  return "";
}
