import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TopBarberShop",
    template: "%s | TopBarberShop",
  },
  description: "Frizerie premium in Ialoveni, programari rapide si servicii de calitate.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "TopBarberShop",
    description: "Frizerie premium in Ialoveni, programari rapide si servicii de calitate.",
    type: "website",
    locale: "ro_RO",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopBarberShop",
    description: "Frizerie premium in Ialoveni, programari rapide si servicii de calitate.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
