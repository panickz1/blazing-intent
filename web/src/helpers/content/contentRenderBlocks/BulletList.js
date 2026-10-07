import React, { memo } from "react";
import ListItem from "./ListItem";

const BulletList = memo(({ content, isNested = false }) => {
  const listClass = isNested ? "sub-list" : "common-list !ml-10 lg:pl-22"; 
  return (
    <ul className={listClass}>
      {content.map((node, index) => (
        <ListItem key={index} content={node.content}>{node.text}</ListItem>
      ))}
    </ul>
  );
});
BulletList.displayName = "BulletList";

export default BulletList;
