import { getPageMetaData, getGeneralThemeData, getPageData } from "@/helpers/api";
import ContentRenderer from "@/helpers/content/ContentRenderer";

const APICollectionKeys = { type: "pages", node: "page_nodes", slug: "homepage" };

export const generateMetadata = async () => await getPageMetaData(APICollectionKeys.type, APICollectionKeys.slug);

export default async function Home() {
  const [generalThemeData, pageData] = await Promise.all([
    getGeneralThemeData(),
    getPageData(APICollectionKeys.type, APICollectionKeys.node, APICollectionKeys.slug),
  ]);
  return <ContentRenderer content={pageData?.content} nodes={pageData?.page_nodes} generalData={generalThemeData} />;
}
