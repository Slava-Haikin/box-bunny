import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import "./globals.css";
import { Separator } from "@/components/ui/separator";
import { MEAL, Recipe } from "@/types";
import { cachedMealPlan, dataManager } from "@/db/managers/data-managers";

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
  const mealPlan = await cachedMealPlan()
  const recipes: Recipe[] = Object.values(mealPlan)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <header>
          <Container className="flex justify-between">
            <Link href={"/"} className="block w-fit">
              <Image
                src={"/logo.svg"}
                width={150}
                height={86}
                alt={"Box Bunny Logo."}
              />
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Meal plan</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {recipes.map((recipe) => {
                    return (
                      <div key={recipe.id}>
                        <div className="grid gap-3 py-2">
                          <div className="space-y-2">
                            <h4 className="leading-none font-medium">{`${recipe.meal}`.toUpperCase()}</h4>
                            <div className="grid items-center gap-4">
                              {recipe.title}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <p className="text-muted-foreground text-sm">
                              {recipe.description}
                            </p>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
              </PopoverContent>
            </Popover>
          </Container>
        </header>

        <main className="flex-1">{children}</main>

        <footer>
          <Container className="text-center">
            The easiest way to healthy life and sexy body.
          </Container>
        </footer>
      </body>
    </html>
  );
}
