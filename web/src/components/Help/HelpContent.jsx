import RelationBlock from "@/helpers/content/contentRenderBlocks/RelationBlock";
import MarkedText from "@/helpers/content/contentRenderBlocks/MarkedText";
import slugify from "@/helpers/functions/slugify";

const isDevelopment = process.env.NODE_ENV === "development";

const H2 = "mt-3.5 scroll-mt-24 font-heading text-[clamp(18px,2vw,22px)] font-bold tracking-[-0.02em] text-white";
const H3 = "mt-2 scroll-mt-24 font-heading text-[17px] font-bold tracking-[-0.015em] text-white";

function Inline({ content }) {
  return (content ?? []).map((node, i) => <MarkedText key={i} text={node.text} marks={node.marks} />);
}

function ItemText({ node }) {
  return (node.content ?? []).flatMap((child, i) =>
    child.type === "paragraph" ? <Inline key={i} content={child.content} /> : null
  );
}

function Cell({ node }) {
  const header = node.type === "tableHeader";
  const text = <Inline content={node.content?.[0]?.content} />;
  return header ? (
    <th className="border-b border-grey-800 pb-2.5 pr-3.5 text-left font-mono text-[10.5px] font-semibold uppercase tracking-[0.11em] text-grey-400 last:pr-0">
      {text}
    </th>
  ) : (
    <td className="border-b border-grey-800 py-3 pr-3.5 text-[15.5px] text-fg-muted first:font-heading first:font-semibold first:text-white last:pr-0">
      {text}
    </td>
  );
}

export default function HelpContent({ content, nodes, generalData }) {
  const render = (node, i) => {
    switch (node.type) {
      case "heading": {
        const text = node.content?.[0]?.text;
        const Tag = node.attrs?.level === 3 ? "h3" : "h2";
        return (
          <Tag key={i} id={text ? slugify(text) : undefined} className={Tag === "h3" ? H3 : H2}>
            <Inline content={node.content} />
          </Tag>
        );
      }
      case "paragraph":
        return (
          <p key={i} className="max-w-[66ch] text-[16px] leading-[1.66] text-fg-muted [text-wrap:pretty] [&_a]:text-primary [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-white">
            <Inline content={node.content} />
          </p>
        );
      case "bulletList":
        return (
          <ul key={i} className="flex max-w-[66ch] flex-col gap-2.5">
            {(node.content ?? []).map((li, j) => (
              <li key={j} className="flex gap-3 text-[16px] leading-[1.6] text-fg-muted [&_strong]:font-semibold [&_strong]:text-white">
                <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-primary" aria-hidden />
                <span><ItemText node={li} /></span>
              </li>
            ))}
          </ul>
        );
      case "orderedList":
        return (
          <ol key={i} className="flex max-w-[66ch] flex-col gap-2.5">
            {(node.content ?? []).map((li, j) => (
              <li key={j} className="flex gap-3.5 text-[16px] leading-[1.6] text-fg-muted [&_strong]:font-semibold [&_strong]:text-white">
                <span className="mt-0.5 flex size-[21px] shrink-0 items-center justify-center rounded-full bg-primary-300 font-mono text-[11px] font-semibold text-primary">
                  {j + 1}
                </span>
                <span><ItemText node={li} /></span>
              </li>
            ))}
          </ol>
        );
      case "table":
        return (
          <div key={i} className="max-w-[560px] overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {(node.content ?? []).map((r, j) => (
                  <tr key={j}>{(r.content ?? []).map((c, k) => <Cell key={k} node={c} />)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "blockquote":
        return (
          <blockquote key={i} className="max-w-[62ch] border-l-2 border-grey-700 pl-5 text-[16px] leading-[1.66] text-fg-muted">
            {(node.content ?? []).map(render)}
          </blockquote>
        );
      case "horizontalRule":
        return <hr key={i} className="border-grey-800" />;
      case "relation-block":
        return <RelationBlock key={i} node={node} nodes={nodes} generalData={generalData} />;
      default:
        if (isDevelopment) {
          return (
            <div key={i} className="rounded-md border border-destructive bg-destructive px-3 py-4 text-xl">
              [Unsupported help content: {node.type}]
            </div>
          );
        }
        return null;
    }
  };

  return <div className="flex flex-col gap-5">{content?.content?.map(render) ?? null}</div>;
}
