import React, { memo } from "react";
import MarkedText from "./MarkedText";

const Code = memo(({ content }) => (
  <code>
    {content?.map((node, index) => (
      <MarkedText key={index} text={node.text} marks={node.marks} />
    ))}
  </code>
));
Code.displayName = "Code";

export default Code;