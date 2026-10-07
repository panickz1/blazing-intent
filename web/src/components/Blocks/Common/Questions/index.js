import { labels, pick } from "@/lib/cms";

const DEFAULT_QUESTIONS = [
  "Why does this take so long?",
  "Why does it need three tools?",
  "Why is it this hard to change?",
];

const INDENT = ["", "lg:ml-[8%]", "lg:ml-[16%]", "lg:ml-[24%]"];

export default function Questions({ eyebrow = "Why we built this", intro, questions, lead, answer, outro }) {
  const opening = pick(intro, "Every team asks the same questions.");
  const items = labels(questions, DEFAULT_QUESTIONS);
  const setup = pick(
    lead,
    "We wanted one answer that removes the friction instead of adding another tool. So we started with one idea:"
  );
  const reply = pick(answer, "Keep it simple.");
  const closing = pick(outro, "Everything else is built on top of that, and nothing gets in its way.");

  return (
    <section className="landing-container py-20 lg:py-32">
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      {opening && <h2 className="mt-4 max-w-[46ch] text-[18px] font-normal leading-relaxed text-fg-muted">{opening}</h2>}

      <ul className="mt-10 flex flex-col gap-2 lg:mt-14">
        {items.map((q, i) => (
          <li
            key={q}
            className={`font-heading text-[clamp(28px,5vw,64px)] font-black leading-[1.05] tracking-[-0.035em] text-grey-600 ${INDENT[i] ?? INDENT[INDENT.length - 1]}`}
          >
            {q}
          </li>
        ))}
      </ul>

      <div className="mt-14 border-t border-grey-800 pt-10 lg:mt-20 lg:flex lg:items-end lg:justify-between lg:gap-16 lg:pt-14">
        <div className="min-w-0">
          {setup && <p className="max-w-[44ch] text-[17px] leading-relaxed text-grey-200">{setup}</p>}
          {reply && (
            <p className="mt-4 font-heading text-[clamp(48px,8vw,112px)] font-black leading-[0.92] tracking-[-0.05em] text-primary lg:whitespace-nowrap">
              {reply}
            </p>
          )}
        </div>
        {closing && (
          <p className="mt-8 max-w-[34ch] shrink-0 text-[17px] leading-relaxed text-fg-muted lg:mt-0 lg:pb-3">{closing}</p>
        )}
      </div>
    </section>
  );
}
