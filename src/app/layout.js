import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://linxy.fun"),

  title: {
    default: "Linxy — Create Your Personal Profile",
    template: "%s | Linxy",
  },

  description:
    "Linxy is a personal profile platform where you can create and customize your own unique profile page.",
  
  verification: {
    google: "NvLLcruVHXlwxwQ4Ap5YT_1bZiWLIWwzQdYcu32csVc",
  },

  keywords: [
    "Linxy",
    "Linxy profile",
    "personal profile",
    "profile page",
    "custom profile",
    "social profile",
  ],

  authors: [{ name: "Linxy" }],
  creator: "Linxy",
  publisher: "Linxy",

  alternates: {
    canonical: "https://linxy.fun",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "Linxy — Create Your Personal Profile",
    description:
      "Create and customize your own personal profile page with Linxy.",
    url: "https://linxy.fun",
    siteName: "Linxy",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Linxy — Create Your Personal Profile",
    description:
      "Create and customize your own personal profile page with Linxy.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}