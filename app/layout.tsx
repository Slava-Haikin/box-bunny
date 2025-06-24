import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Link from "next/link";

import { Container } from "@/components/ui/container";

import "./globals.css";

import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  CircleUserRoundIcon,
} from "lucide-react";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative pb-18`}
      >
        <div className={`flex min-h-screen flex-col`}>
          {children}
          {/* <header>
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
          </header> */}

          {/* <main className="flex-1">{children}</main> */}

          {/* <footer>
            <Container className="text-center">
              The easiest way to healthy life and sexy body.
            </Container>
          </footer> */}
        </div>

        <Container className="fixed bottom-0 left-0 right-0 p-0 bg-white">
          <nav
            className="p-4 rounded-t-2xl"
            style={{ boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <ul className="flex justify-between items-center gap-4 mx-auto">
              <li className="w-10 h-10">
                <Link
                  href={"todo"}
                  className="flex justify-center items-center"
                >
                  <CircleCheckBigIcon width="100%" height="auto" />
                </Link>
              </li>
              <li className="w-10 h-10">
                <Link href={"/"} className="flex justify-center items-center">
                  <CalendarDaysIcon width="100%" height="auto" />
                  <span className="hidden">To-do list</span>
                </Link>
              </li>
              <li className="w-10 h-10">
                <Link
                  href={"profile"}
                  className="flex justify-center items-center"
                >
                  <CircleUserRoundIcon width="100%" height="auto" />
                  <span className="hidden">Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </body>
    </html>
  );
}
