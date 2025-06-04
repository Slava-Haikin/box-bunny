import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { seedData } from "@/db";

import { dataManager } from "@/db/managers/data-managers";

export default async function Home() {
  return (
    <Container>
      <div className="flex w-full flex-col gap-6 items-center">
        <Tabs defaultValue="grocery-list" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="grocery-list">Grocery list</TabsTrigger>
            <TabsTrigger value="preparation">Cooking instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="grocery-list">1</TabsContent>
          <TabsContent value="preparation">2</TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
