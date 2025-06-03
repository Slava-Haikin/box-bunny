import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  return (
    <Container>
      <div className="flex w-full flex-col gap-6 items-center">
        <Tabs defaultValue="grocery-list" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="grocery-list">Grocery list</TabsTrigger>
            <TabsTrigger value="preparation">Cooking</TabsTrigger>
          </TabsList>
          <TabsContent value="grocery-list">1</TabsContent>
          <TabsContent value="preparation">2</TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
