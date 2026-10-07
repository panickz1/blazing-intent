import React, { memo } from "react";
import { blocks } from "@/app/blocks";

const isDevelopment = process.env.NODE_ENV === 'development';

function unset(item) {
  const out = {};
  for (const key in item) {
    if (item[key] !== null) out[key] = item[key];
  }
  return out;
}

const RelationBlock = memo(({ node, nodes, generalData }) => {
  const matchedNode = nodes?.find((n) => n.id === node.attrs.id);
  if (!matchedNode) {
    if (isDevelopment) {
      return <div className="bg-destructive border border-destructive rounded-md text-xl px-3 py-4 mt-4">Node not found &quot;{node?.attrs?.collection}&quot;</div>;
    }
    return null;
  }

  const componentSlug = matchedNode.collection;
  const Component = blocks.get(componentSlug);
  if (!Component) {
    if (isDevelopment) {
      return <div className="bg-destructive border border-destructive rounded-md text-xl px-3 py-4 mt-4">Component not found &quot;{componentSlug}&quot;</div>;
    }
    return null;
  }

  return <Component key={matchedNode.id} {...unset(matchedNode.item)} generalData={generalData} />;
});
RelationBlock.displayName = "RelationBlock";

export default RelationBlock;