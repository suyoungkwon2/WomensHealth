import type { Metadata } from "next";
import { DM_Sans, Zen_Old_Mincho } from "next/font/google";
import { SITE_TITLE } from "@/lib/parts";
import "./globals.css";

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: "A scrollytelling story about women’s health in the blind spot of medical care.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${zenOldMincho.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
