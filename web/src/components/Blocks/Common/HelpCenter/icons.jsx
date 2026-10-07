const P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 4h12v5a6 6 0 0 1-12 0z" />
      <path d="M6 6H4a2 2 0 0 0 0 4h2M18 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M10 15h4M9 20h6M12 15v5" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h12v4" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H5a2 2 0 0 1-2-2z" />
      <circle cx="16.5" cy="13.5" r="1.1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20z" />,
  gift: (
    <>
      <path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M3 7.5h18V11H3zM12 7.5V21" />
      <path d="M12 7.5H8.2a2.1 2.1 0 1 1 0-4.2c2.2 0 3.8 4.2 3.8 4.2zM12 7.5h3.8a2.1 2.1 0 1 0 0-4.2c-2.2 0-3.8 4.2-3.8 4.2z" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 16.94 6.75 19.7l1-5.85L3.5 9.7l5.9-.9z" />,
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.4" />
      <path d="M12 17.2h.01" />
    </>
  ),
};

export function HelpIcon({ name, className }) {
  const glyph = ICONS[name] ?? ICONS.question;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...P}>
      {glyph}
    </svg>
  );
}

