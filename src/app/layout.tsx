import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitcoin Uber",
  description: "Bitcoin uber: pay for your local uber with bitcoin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full ">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="h-full">
            <nav className="flex items-center w-full h-10 shadow-md">
              <div className="mx-auto font-semibold">
                Bitcoin Uber
              </div>
            </nav>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
