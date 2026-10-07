import MarkdownToJsx from "markdown-to-jsx";
import Link from "next/link";
import { cn } from "@/lib/utils";
import slugify from "@/helpers/functions/slugify";

function textOf(node) {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return textOf(node.props?.children);
}

function heading(level, className) {
  const Tag = `h${level}`;
  return function H({ children, className: incoming, ...props }) {
    return (
      <Tag
        {...props}
        id={slugify(textOf(children))}
        className={cn("scroll-mt-28", className, incoming)}
      >
        {children}
      </Tag>
    );
  };
}

const DOCUMENT_TYPES = /\.(pdf|docx?|xlsx?|csv|zip)(\?|#|$)/i;

function DocumentIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function DownloadIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function DocumentLink({ href, children }) {
  const ext = (href.match(DOCUMENT_TYPES)?.[1] ?? "file").toUpperCase();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-2 inline-flex max-w-full items-center gap-3 rounded-xl border border-grey-700 bg-grey-900 px-4 py-3 align-middle no-underline transition-colors hover:border-primary/50 hover:bg-grey-800"
    >
      <DocumentIcon className="size-5 shrink-0 text-primary" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-heading text-[15px] font-black text-white">{children}</span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-grey-500">
          {ext} · opens in a new tab
        </span>
      </span>
      <DownloadIcon className="size-4 shrink-0 text-grey-500 transition-colors group-hover:text-white" />
    </a>
  );
}

function Anchor({ href = "", children, className: incoming, ...props }) {
  if (DOCUMENT_TYPES.test(href)) return <DocumentLink href={href}>{children}</DocumentLink>;

  const internal = href.startsWith("/") || href.startsWith("#");
  const style = cn("font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary", incoming);

  if (internal) {
    return <Link {...props} href={href} className={style}>{children}</Link>;
  }
  return (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer" className={style}>
      {children}
    </a>
  );
}

const OVERRIDES = {
  h1: { component: heading(1, "mt-12 font-heading text-[34px] font-black tracking-[-0.02em] text-white") },
  h2: { component: heading(2, "mt-12 font-heading text-[26px] font-black tracking-[-0.02em] text-white") },
  h3: { component: heading(3, "mt-9 font-heading text-[19px] font-black text-white") },
  h4: { component: heading(4, "mt-7 font-heading text-[16px] font-black text-white") },
  p: { props: { className: "mt-5 text-[16px] leading-[1.75] text-grey-200" } },
  a: { component: Anchor },
  strong: { props: { className: "font-semibold text-white" } },
  em: { props: { className: "italic" } },
  ul: { props: { className: "mt-5 list-disc space-y-2 pl-5 text-[16px] leading-[1.75] text-grey-200 marker:text-primary" } },
  ol: { props: { className: "mt-5 list-decimal space-y-2 pl-5 text-[16px] leading-[1.75] text-grey-200 marker:text-grey-500" } },
  li: { props: { className: "pl-1" } },
  hr: { props: { className: "my-10 border-grey-800" } },
  blockquote: {
    props: {
      className:
        "mt-6 border-l-2 border-primary bg-grey-900/60 py-3 pl-5 pr-4 text-[15px] leading-relaxed text-grey-200 [&>p]:mt-0",
    },
  },
  code: { props: { className: "rounded bg-grey-800 px-1.5 py-0.5 font-mono text-[13.5px] text-white" } },
  pre: {
    props: {
      className:
        "mt-6 overflow-x-auto rounded-xl border border-grey-800 bg-grey-900 p-4 text-[13.5px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0",
    },
  },
  table: {
    component: function Table({ children, ...props }) {
      return (
        <div className="mt-7 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px]" {...props}>
            {children}
          </table>
        </div>
      );
    },
  },
  thead: { props: { className: "border-b border-grey-700" } },
  th: { props: { className: "py-3 pr-4 text-[11px] font-semibold uppercase tracking-widest text-primary" } },
  tbody: { props: { className: "divide-y divide-grey-800" } },
  td: { props: { className: "py-3 pr-4 align-top text-grey-200" } },
  img: { props: { className: "mt-7 h-auto w-full rounded-xl border border-grey-800" } },
};

export function Markdown({ children }) {
  return <MarkdownToJsx options={{ overrides: OVERRIDES, forceBlock: true }}>{children}</MarkdownToJsx>;
}
