import Schema from "@/helpers/SEO/Schema";
import { rows } from "@/lib/cms";

export default function Steps(props) {
  const steps = rows(props?.items, []);
  if (steps.length === 0) return null;

  return (
    <>
      <Schema type="howTo" data={props} />
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div
            key={index}
            className="grid grid-cols-[34px_minmax(0,1fr)] gap-4 border-t border-grey-800 py-[17px] last:border-b"
          >
            <span className="pt-[3px] font-mono text-[12px] font-semibold text-primary">
              {index + 1}
            </span>
            <div>
              <b className="block font-heading text-[16.5px] font-bold tracking-[-0.015em] text-white">
                {step.title}
              </b>
              <p className="mt-1.5 text-[15.5px] leading-[1.6] text-fg-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
