import "../style.css";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return [{ lang: "bn" }, { lang: "en" }];
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "bn" && lang !== "en") notFound();
  return (
    <html lang={lang} translate="no" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
