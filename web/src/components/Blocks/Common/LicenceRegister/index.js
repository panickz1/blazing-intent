import { pick } from "@/lib/cms";
import { getLicenceRegister } from "@/lib/casinos";
import { SectionHeader } from "@/components/ui/section-header";
import RegisterClient from "./RegisterClient";

const FILTERS = {
  active: (r) => r.status === "active" || r.status === "pending",
  inactive: (r) => r.status === "suspended" || r.status === "revoked",
};

export default async function LicenceRegister({ eyebrow, title, lead, statusFilter, regulator, footnote }) {
  const all = await getLicenceRegister();
  const rows = FILTERS[statusFilter] ? all.filter(FILTERS[statusFilter]) : all;
  if (rows.length === 0) return null;
  const licenceHeading = regulator ? `Licence (${regulator})` : "Licence";

  return (
    <section className="py-14 lg:py-20">
      <div className="landing-container max-w-[960px]">
        <SectionHeader eyebrow={eyebrow} title={pick(title, "Licence register")} lead={lead} />
        <RegisterClient rows={rows} licenceHeading={licenceHeading} />
        {footnote && <p className="m-0 mt-3 text-[12px] text-grey-400">{footnote}</p>}
      </div>
    </section>
  );
}
