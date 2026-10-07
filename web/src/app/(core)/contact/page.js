import LeadPageForm from "@/components/lead/LeadPageForm";
import PageIntro from "@/components/Layout/PageIntro";
import { site } from "@/site.config";

export const metadata = {
  title: site.leadForm.title,
  description: site.leadForm.description,
};

export default function ContactPage() {
  return (
    <section className="landing-container pb-16 lg:pb-24">
      <PageIntro
        breadcrumbs={[{ name: site.leadForm.title, url: site.leadForm.path }]}
        title={site.leadForm.title}
        lead={site.leadForm.description}
      />
      <div className="mt-8 max-w-[560px] rounded-3xl border border-grey-800 bg-grey-900 p-6 lg:p-8">
        <LeadPageForm />
      </div>
    </section>
  );
}
