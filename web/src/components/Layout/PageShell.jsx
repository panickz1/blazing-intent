import { PAGE_TOP } from "./PageIntro";

export default function PageShell({ children }) {
  return (
    <section id="page-content" className="landing-container">
      <div className={`${PAGE_TOP} flex flex-col gap-4 md:gap-6`}>{children}</div>
    </section>
  );
}
