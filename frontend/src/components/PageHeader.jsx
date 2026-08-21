const PageHeader = ({ eyebrow, title, description, action }) => (
  <header className="flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </span>
      )}
      <h1 className="section-title mt-1.5">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </div>
    {action}
  </header>
);

export default PageHeader;
