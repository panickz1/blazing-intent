import React, { memo } from "react";
import MarkedText from "./MarkedText";

const Heading = memo(({ level, content, id }) => {
  const HeadingTag = `h${Math.min(Math.max(Number(level) || 2, 2), 6)}`;
  return (
    <HeadingTag className="common-title px-0 lg:px-8 scroll-mt-20" id={id}>
      {content?.map((node, index) => (
        <MarkedText key={index} text={node.text} marks={node.marks} />
      ))}
    </HeadingTag>
  );
});
Heading.displayName = "Heading";

export default Heading;