import React, { memo } from "react";
import MarkedText from "./MarkedText";

const Paragraph = memo(({ content, px = true }) => (
  <p className={`paragraph text-white/80 px-0 ${px ? "lg:px-8" : " px-0"}`}>
    {content?.map((node, index) => (
      <MarkedText key={index} text={node.text} marks={node.marks} />
    ))}
  </p>
));
Paragraph.displayName = "Paragraph";

export default Paragraph;