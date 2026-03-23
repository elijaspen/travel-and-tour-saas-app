import type { ReactNode } from "react";

type FormStepLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormStepLayout({ title, description, children }: FormStepLayoutProps) {
  return (
    <div className="max-w-[800px] mx-auto w-full">
      <div className={description ? "mb-8" : "mb-6"}>
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
