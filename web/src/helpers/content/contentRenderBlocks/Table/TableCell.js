import React, { memo } from "react";
import Paragraph from "../Paragraph";

const TableCell = memo(({ content }) => (
  <td>
    {content?.map((item, index) => {
      if (item.type === 'paragraph') {
        return <Paragraph key={index} content={item.content} />;
      }
      return <span key={index}>Unhandled cell content type: {item.type}</span>;
    })}
  </td>
));
TableCell.displayName = "TableCell";

export default TableCell;