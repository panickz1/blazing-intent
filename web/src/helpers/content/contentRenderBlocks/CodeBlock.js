import React, { memo } from "react";

const CodeBlock = memo(({ content }) => (
  <pre>
    <code>
      {content?.map((node) => (
        node.text || ''
      )).join('')}
    </code>
  </pre>
));
CodeBlock.displayName = "CodeBlock";

export default CodeBlock;