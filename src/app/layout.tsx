import type { Metadata } from "next";
import { Fira_Code, Gochi_Hand, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/shared/providers/AppProviders";

const geistSans = localFont({
  variable: "--font-geist-sans",
  src: [
    {
      path: "../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  src: [
    {
      path: "../../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});

const gochiHand = Gochi_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gochi-hand",
  display: "swap",
});

const firaCode = Fira_Code({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "App", template: "%s | App" },
  description: "Application",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${gochiHand.variable} ${firaCode.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
