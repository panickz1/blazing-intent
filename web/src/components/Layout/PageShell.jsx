export default function PageShell({ children }) {
  return (
    <section id="page-content" className="landing-container">
      <div className="mt-8 flex flex-col gap-4 md:gap-6">{children}</div>
    </section>
  );
}
