import { site } from "@/site.config";

export default function ComplianceBar() {
  if (!site.compliance?.topBar) return null;
  return (
    <div className="border-b border-grey-800 bg-grey-900 px-4 py-1.5 text-center text-[10.5px] font-semibold uppercase tracking-[0.12em] text-grey-300">
      {site.compliance.topBar}
    </div>
  );
}
