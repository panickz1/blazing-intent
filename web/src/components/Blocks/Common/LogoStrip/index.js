import Image from "next/image";
import { getMediaMentions } from "@/lib/media";

export default async function LogoStrip({ eyebrow, title, lead }) {
  const mentions = await getMediaMentions();
  if (mentions.length === 0) return null;

  return (
    <section className="border-y border-grey-800 py-10">
      <div className="landing-container">
        {(eyebrow || title) && (
          <h2 className="m-0 text-center text-[13px] font-semibold text-fg-muted">{title || eyebrow}</h2>
        )}
        {lead && <p className="m-0 mx-auto mt-2 max-w-[60ch] text-center text-[14px] text-grey-300">{lead}</p>}
        <ul className="m-0 mt-6 flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-5 p-0">
          {mentions.map((m) => {
            const mark = m.logo?.src ? (
              <Image src={m.logo.src} alt={m.name} width={m.logo.width} height={m.logo.height} className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
            ) : (
              <span className="font-heading text-[18px] font-bold tracking-[-0.01em] text-grey-300 transition-colors hover:text-white">{m.name}</span>
            );
            return (
              <li key={m.id}>
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noopener" aria-label={m.logo?.src ? m.name : undefined}>
                    {mark}
                  </a>
                ) : (
                  mark
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
