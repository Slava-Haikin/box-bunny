import "reflect-metadata"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { cachedMealPlan, dataManager } from "@/db/old/managers";
import { Recipe } from "@/types";

export default async function Home() {
  const mealPlan = await cachedMealPlan();
  const recipes: Recipe[] = Object.values(mealPlan);
  const groceryList = await dataManager.deriveGroceryList(mealPlan);
  const groceryListData = Object.entries(groceryList);

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
                  <ul className="grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4 p-2">
                    {products.map((product) => (
                      <li key={product.id}>
                        <Label
                          htmlFor={product.id}
                          className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full justify-start"
                        >
                          <Checkbox id={product.id} />
                          <span>
                            {product.name.toUpperCase()}
                            {" / "}
                            {product.quantity} {product.unit}
                          </span>
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
              {recipes.map((meal) => (
                <AccordionItem value={meal.id} key={meal.id}>
                  <AccordionTrigger>{meal.title}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <ol>
                      {meal.instructions
                        .split(";")
                        .map((instruction, index) => (
                          <li key={instruction}>
                            {index + 1}
                            {". "}
                            {instruction}
                          </li>
                        ))}
                    </ol>
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
