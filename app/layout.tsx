import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";

import "./globals.css";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Prep App | Box Bunny",
  description: "Keep it tight - keep health right!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-[100vw] overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
        >
          <header>
            <Container className="flex justify-between items-center">
              <Link href={"/"} className="block w-fit">
                <Image
                  src={"/logo.svg"}
                  width={150}
                  height={86}
                  alt={"Box Bunny Logo."}
                />
              </Link>
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Userpic."
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Container>
          </header>

          <main className="flex-1">{children}</main>

          <footer>
            <Container className="text-center">
              The easiest way to healthy life and sexy body.
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
