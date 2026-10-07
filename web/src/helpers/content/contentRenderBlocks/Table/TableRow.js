import React, { memo } from "react";
import TableCell from "./TableCell";

const TableRow = memo(({ content }) => (
  <tr>
    {content.map((cell, index) => (
      <TableCell key={index} content={cell.content} />
    ))}
  </tr>
));
TableRow.displayName = "TableRow";

export default TableRow;