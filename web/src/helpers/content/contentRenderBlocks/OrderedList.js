import React, { memo } from "react";
import  ListItem from "./ListItem";

const OrderedList = memo(({ content, isNested = false }) => {
  const listClass = isNested ? "sub-list" : "ordered-list !ml-10 lg:pl-22";
  return (
    <ol className={listClass}>
      {content.map((node, index) => (
        <ListItem key={index} content={node.content} isNested={true}>
          {node.text}
        </ListItem>
      ))}
    </ol>
  );
});
OrderedList.displayName = "OrderedList";

export default OrderedList;