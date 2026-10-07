import React, { memo } from "react";

const MarkedText = memo(({ text, marks }) => {
  if (!marks || marks.length === 0) return text;

  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{acc}</strong>;
      case "italic":
        return <em>{acc}</em>;
      case "underline":
        return <u>{acc}</u>;
      case "strike":
        return <del>{acc}</del>;
      case "link": {
        const href = mark.attrs?.href || "";
        const external = /^(https?:)?\/\//i.test(href) || /^mailto:|^tel:/i.test(href);
        return external ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {acc}
          </a>
        ) : (
          <a href={href}>{acc}</a>
        );
      }
      default:
        return acc;
    }
  }, text);
});
MarkedText.displayName = "MarkedText";

export default MarkedText;