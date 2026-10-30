import { Fragment } from "react";
import { useT } from "../i18n";

/* A placeholder price or number, shown as a chip so it reads as intentional
   (see src/data/pricing.ts). */
export function DemoValue({ children }: { children: string }) {
  const t = useT();
  return (
    <span className="demo-value" title={t.demo.valueTitle}>
      {children}
    </span>
  );
}

/* Renders a dictionary string, turning every {{X}} into a <DemoValue>. */
export function DemoText({ text }: { text: string }) {
  const parts = text.split(/\{\{(.+?)\}\}/);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{i % 2 ? <DemoValue>{part}</DemoValue> : part}</Fragment>
      ))}
    </>
  );
}
