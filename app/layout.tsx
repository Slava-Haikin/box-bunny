import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Link from "next/link";
import Image from 'next/image';

import { Container } from "@/components/ui/container";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
  title: "Meal Prep App | Box Bunny",
  description: "Keep it tight - keep health right!",
 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <header>
          <Container className="flex justify-between">
            <Link href={'/'} className="block w-fit">
              <Image src={"/logo.svg"} width={150} height={86} alt={"Box Bunny Logo."} />
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Week menu</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Dimensions</h4>
                    <p className="text-muted-foreground text-sm">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      123
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Container>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer>
          <Container className="text-center">
            A meal prep app.
          </Container>
        </footer>
      </body>
      
    </html>
  );
}
