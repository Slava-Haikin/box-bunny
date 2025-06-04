import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { cachedMealPlan, dataManager } from "@/db/managers/data-managers";

export default async function Home() {
  const mealPlan = await cachedMealPlan()
  const groceryList = await dataManager.deriveGroceryList(mealPlan)
  const groceryListData = Object.entries(groceryList)

  return (
    <Container>
      <div className="flex w-full flex-col gap-6 items-center">
        <Tabs defaultValue="grocery-list" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="grocery-list">Grocery list</TabsTrigger>
            <TabsTrigger value="preparation">Cooking instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="grocery-list">
            <section>
              {groceryListData.map(([aisle, products]) => (
                <div key={aisle}>
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {aisle}
                  </h2>
                  <ul className="grid grid-cols-auto gap-6 py-4 p-2">
                    {products.map(product => (
                      <li className="flex items-center gap-3" key={product.id}>
                        <Checkbox id={product.id} />
                        <Label htmlFor={product.id}>
                          {product.name.toUpperCase()}
                          {' / '}
                          {product.quantity}
                        </Label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </TabsContent>
          <TabsContent value="preparation">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={Object.values(mealPlan).at(0).id}
            >
              {Object.values(mealPlan).map(meal => (
                <AccordionItem value={meal.id} key={meal.id}>
                  <AccordionTrigger>
                    {meal.title}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    {meal.instructions}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
