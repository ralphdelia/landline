import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Landline Company",
  description: "Book your bus trip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-stone-200 font-sans">
          <nav className="flex w-full justify-center border-b border-stone-500">
            <div className="w-full max-w-3xl border-x border-stone-500 p-2">
              <Link className="hover:cursor-pointer" href={"/"}>
                <h1 className="text-lg font-bold">The Landline Company</h1>
              </Link>
            </div>
          </nav>
          <div className="flex flex-1 justify-center">
            <main className="flex w-full max-w-3xl flex-col items-center border-x border-stone-500 bg-stone-200 pb-10">
              <div className="w-full p-4">{children}</div>
            </main>
          </div>
          <footer className="flex w-full justify-center border-t border-stone-500">
            <div className="w-full max-w-3xl border-x border-stone-500 p-2">
              <p className="text-sm text-stone-600">
                © {new Date().getFullYear()} The Landline Company
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
