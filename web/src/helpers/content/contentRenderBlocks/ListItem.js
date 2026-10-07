import React, { memo } from "react";
import Paragraph from "./Paragraph";
import MarkedText from "./MarkedText";
import BulletList from "./BulletList";
import OrderedList from "./OrderedList";

const ListItem = memo(({ content }) => {
  return (
    <li>
      {content?.map((node, index) => {
        switch (node.type) {
          case "paragraph":
            return <Paragraph key={index} content={node.content} px={false} />;
          case "bulletList":
            return <BulletList key={index} content={node.content} isNested={true} />;
          case "orderedList":
            return <OrderedList key={index} content={node.content} isNested={true} />;
          default:
            return <MarkedText key={index} text={node.text} marks={node.marks} />;
        }
      })}
    </li>
  );
});
ListItem.displayName = "ListItem";

export default ListItem;