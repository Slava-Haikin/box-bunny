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
import { GroceryList, Recipe, WeekMealPlan } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface HomePageProps {
  weekMealPlan: WeekMealPlan;
  groceryList: GroceryList;
}

export function findMenuByDate(
  weekMealPlan: WeekMealPlan,
  date = new Date(),
): WeekMealPlan["menus"][number] | undefined {
  return weekMealPlan.menus.find(({ period }) => {
    return date >= period.start && date <= period.end;
  });
}

export default function HomePage({ weekMealPlan, groceryList }: HomePageProps) {
  const menuWithPeriod = findMenuByDate(weekMealPlan);
  const menu = Object.values(menuWithPeriod?.menu ?? {}) as Recipe[];

  return (
    <Container>
      <div className="flex justify-between mb-8">
        <h1>This week:</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Meal plan</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            {menu.map((recipe) => {
              return (
                <div key={recipe.id}>
                  <div className="grid gap-3 py-2">
                    <div className="space-y-2">
                      <h4 className="leading-none font-medium">
                        {`${recipe.name}`.toUpperCase()}
                      </h4>
                      <div className="grid items-center gap-4">
                        {recipe.name}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-muted-foreground text-sm">
                        {recipe.name}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </div>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex w-full flex-col gap-6 items-center">
        <Tabs defaultValue="grocery-list" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="grocery-list">Grocery list</TabsTrigger>
            <TabsTrigger value="preparation">Cooking instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="grocery-list">
            <section>
              {groceryList.map(([aisle, products]) => (
                <div key={aisle}>
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {aisle}
                  </h2>
                  <ul className="grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4 p-2">
                    {products.map((product) => (
                      <li key={product.id}>
                        <Label
                          htmlFor={String(product.id)}
                          className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full justify-start"
                        >
                          <Checkbox id={String(product.id)} />
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
              defaultValue={Object.values(weekMealPlan).at(0).id}
            >
              {menu.map((recipe) => (
                <AccordionItem value={String(recipe.id)} key={recipe.id}>
                  <AccordionTrigger>{recipe.name}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <ol>
                      {recipe.instructions.map((instruction, index) => (
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
