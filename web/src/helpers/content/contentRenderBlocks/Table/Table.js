import React, { memo } from "react";
import TableRow from "./TableRow";

const Table = memo(({ content }) => (
  <table className="common-table px-0 lg:mx-8">
    <tbody>
      {content.map((row, index) => (
        <TableRow key={index} content={row.content} />
      ))}
    </tbody>
  </table>
));
Table.displayName = "Table";

export  default Table;