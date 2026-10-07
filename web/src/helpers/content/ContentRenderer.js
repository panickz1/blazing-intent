import slugify from "../functions/slugify";
import Paragraph from './contentRenderBlocks/Paragraph';
import Heading from './contentRenderBlocks/Heading';
import OrderedList from './contentRenderBlocks/OrderedList';
import BulletList from './contentRenderBlocks/BulletList';
import Table from './contentRenderBlocks/Table/Table';
import Code from './contentRenderBlocks/Code';
import CodeBlock from './contentRenderBlocks/CodeBlock';
import RelationBlock from './contentRenderBlocks/RelationBlock';

const isDevelopment = process.env.NODE_ENV === 'development';

const ContentRenderer = ({ content, nodes, generalData }) => {
  const nodeTypeMap = {
    heading: (node, index) => {
      const text = node.content?.[0]?.text;
      const headingId = text ? slugify(text) : null;
      return <Heading key={index} level={node.attrs.level} content={node.content} id={headingId} />;
    },
    paragraph: (node, index) => <Paragraph key={index} content={node.content} />,
    bulletList: (node, index) => <BulletList key={index} content={node.content} />,
    orderedList: (node, index) => <OrderedList key={index} content={node.content} />,
    table: (node, index) => <Table key={index} content={node.content} />,
    code: (node, index) => <Code key={index} content={node.content} />,
    codeBlock: (node, index) => <CodeBlock key={index} content={node.content} />,
    horizontalRule: (node, index) => <hr key={index} className="article-hr" />,
    blockquote: (node, index) => (
      <blockquote key={index} className="article-quote">
        {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
      </blockquote>
    ),
    'relation-block': (node, index) => <RelationBlock key={index} node={node} nodes={nodes} generalData={generalData} />,
  };

  const renderNode = (node, index) => {
    const renderFunction = nodeTypeMap[node.type];
    if (renderFunction) {
      return renderFunction(node, index);
    } else if (isDevelopment) {
      return <div key={index} className="bg-destructive border border-destructive rounded-md text-xl px-3 py-4 mt-4">[Unsupported Content Type: {node.type}]</div>;
    }
    return null;
  };

  return (content?.content?.map((node, index) => renderNode(node, index)) || null);
};

ContentRenderer.displayName = "ContentRenderer";

export default ContentRenderer;