import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smoke Pal",
  description: "Precision smoking made easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={"h-full w-full"}> {children}</body>
    </html>
  );
}
