interface ExploreBreadcrumbsProps {
  items: string[];
}

export function ExploreBreadcrumbs({ items }: ExploreBreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}

            <span className={isLast ? "font-medium text-slate-900" : "text-slate-500"}>{item}</span>
          </span>
        );
      })}
    </nav>
  );
}
