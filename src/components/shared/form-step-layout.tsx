import React from "react";

type FormStepLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FormStepLayout({ title, description, children }: FormStepLayoutProps) {
  return (
    <div className="max-w-[800px] mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
