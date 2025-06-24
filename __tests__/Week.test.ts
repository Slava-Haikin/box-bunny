import Week from "@/data/Week";
import { CookingStyle } from "@/types";

import { expect, test } from "vitest";

test("Week", () => {
  const week = new Week(new Date("1999-03-31")); // Wednesday

  const startDateResult = new Date("1999-03-29");
  startDateResult.setUTCHours(0, 0, 0, 0);

  const endDateResult = new Date("1999-04-04");
  endDateResult.setUTCHours(23, 59, 59, 999);

  const workingWeekStyle = CookingStyle.Lazy;
  const weekendStyle = CookingStyle.Lazy;

  expect(week.getWeekPeriod()).toEqual({
    start: startDateResult,
    end: endDateResult,
  });
  expect(week.getWeekDates().map((d) => d.toDateString())).toEqual([
    "Mon Mar 29 1999",
    "Tue Mar 30 1999",
    "Wed Mar 31 1999",
    "Thu Apr 01 1999",
    "Fri Apr 02 1999",
    "Sat Apr 03 1999",
    "Sun Apr 04 1999",
  ]);

  const menuPeriods = week.getMenuPeriods(workingWeekStyle, weekendStyle, true);

  expect(menuPeriods).toEqual([
    {
      start: new Date(Date.UTC(1999, 2, 29, 0, 0, 0, 0)), // Mon Mar 29
      end: new Date(Date.UTC(1999, 3, 2, 23, 59, 59, 999)), // Fri Apr 02
    },
    {
      start: new Date(Date.UTC(1999, 3, 3, 0, 0, 0, 0)), // Sat Apr 03
      end: new Date(Date.UTC(1999, 3, 4, 23, 59, 59, 999)), // Sun Apr 04
    },
  ]);
});
