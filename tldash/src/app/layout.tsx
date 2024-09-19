import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "../components/SessionWrapper.tsx";

export const metadata: Metadata = {
  title: "Tiny Linker",
  description: "An app to shorten your links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en" data-theme="cupcake">
        <body>
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
