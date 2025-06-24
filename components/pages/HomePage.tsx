import { Container } from "@/components/ui/container";
import { GroceryList, Recipe, WeekMealPlan } from "@/types";
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

export default function HomePage({ weekMealPlan }: HomePageProps) {
  const menuWithPeriod = findMenuByDate(weekMealPlan);
  const menu = Object.values(menuWithPeriod?.menu ?? {}) as Recipe[];

  return (
    <Container>
      <div>
        <h1 className="mb-10">This week:</h1>
        <div className="w-80">
          {menu.map((recipe) => {
            return (
              <div key={recipe.id}>
                <div className="grid gap-3 py-2">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">
                      {`${recipe.name}`.toUpperCase()}
                    </h4>
                    <div className="grid items-center gap-4">{recipe.name}</div>
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
        </div>
      </div>
    </Container>
  );
}
