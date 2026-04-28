// src/app/layout.tsx
import { Bungee, Manrope } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import PasswordGate from "@/components/PasswordGate"; // Path should work now

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
});

const svnGilroySemiBold = localFont({
  src: "./fonts/SVN-Gilroy-SemiBold.otf",
  variable: "--font-svn-gilroy",
});

const goliSemiBold = localFont({
  src: "./fonts/GoliSemiBold.otf",
  variable: "--font-goli-semibold",
});

const haloGrotesk = localFont({
  src: "./fonts/HaloGrotesk-Regular.otf",
  variable: "--font-halo-grotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${bungee.variable} ${svnGilroySemiBold.variable} ${goliSemiBold.variable} ${haloGrotesk.variable}`}
      >
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
