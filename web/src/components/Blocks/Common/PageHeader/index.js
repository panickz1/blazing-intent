import { pick } from "@/lib/cms";
import PageIntro from "@/components/Layout/PageIntro";

export default function PageHeader({ eyebrow, title, titleAccent, description, generalData }) {
  return (
    <section className="landing-container">
      <PageIntro
        breadcrumbs={generalData?.breadcrumbs}
        eyebrow={eyebrow}
        title={pick(title, "Page title")}
        titleAccent={titleAccent}
        lead={description}
      />
    </section>
  );
}
