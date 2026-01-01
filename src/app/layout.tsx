import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

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
      <body
        className={`${manrope.variable} ${playfair.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
