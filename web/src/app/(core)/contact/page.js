import LeadPageForm from "@/components/lead/LeadPageForm";
import { site } from "@/site.config";

export const metadata = {
  title: site.leadForm.title,
  description: site.leadForm.description,
};

export default function ContactPage() {
  return (
    <section className="landing-container-narrow py-16 lg:py-24">
      <div className="mx-auto max-w-[560px] rounded-3xl border border-grey-800 bg-grey-900 p-6 lg:p-8">
        <LeadPageForm />
      </div>
    </section>
  );
}
