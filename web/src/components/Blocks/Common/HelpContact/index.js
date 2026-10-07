import { pick } from "@/lib/cms";
import { site } from "@/site.config";

function MailIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3.5 7.5h17v11h-17zM3.5 8l8.5 6 8.5-6" />
    </svg>
  );
}

export default function HelpContact(props) {
  const title = pick(props.title, "Can't find your answer?");
  const email = pick(props.email, site.contact.email);
  const buttonLabel = pick(props.buttonLabel, "Contact Support →");
  const description = props.description;

  const buttonHref = pick(props.buttonUrl, `mailto:${email}`);

  const container = props.width === "article" ? "help-article-x" : "landing-container-prose";

  return (
    <section className={`${container} pb-[clamp(40px,5vw,72px)]`}>
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-grey-800 p-[clamp(24px,3vw,34px)]"
           style={{ background: "linear-gradient(120deg, #12141A, hsl(var(--grey-950)))" }}>
        <div className="flex flex-col items-start gap-[9px]">
          <h2 className="!my-0 font-heading text-[clamp(20px,2.2vw,27px)] font-extrabold leading-tight tracking-[-0.025em] text-white">
            {title}
          </h2>
          {description && (
            <p className="max-w-md text-[15px] leading-relaxed text-fg-muted">{description}</p>
          )}
          <a
            href={`mailto:${email}`}
            className="flex w-fit items-center gap-2.5 text-[16px] font-semibold leading-none text-primary hover:underline"
          >
            <MailIcon className="size-[17px] shrink-0" />
            {email}
          </a>
        </div>

        <a
          href={buttonHref}
          className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-heading text-[15px] font-bold text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary-0)/0.32)] transition-transform hover:-translate-y-0.5"
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  );
}
