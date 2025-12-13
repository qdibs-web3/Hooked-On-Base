import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/wallet/Web3Provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hooked - Web3 Fishing Game on Base",
  description: "Cast your line, catch rare fish, earn $HOOK tokens, and climb the leaderboard in this addictive Web3 fishing game built for Base.",
  keywords: ["Web3", "Fishing Game", "Base", "Coinbase", "$HOOK", "NFT", "Blockchain Game"],
  authors: [{ name: "Hooked Team" }],
  openGraph: {
    title: "Hooked - Web3 Fishing Game",
    description: "Cast your line and catch rare fish on Base blockchain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-b from-sky-200 via-blue-100 to-cyan-100 min-h-screen`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
