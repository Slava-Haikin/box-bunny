import { Period, WEEK_DURATION } from "@/types";

export default class Week {
    private week: Period;

    constructor(public day: Date) {
        const weekDay = day.getDay() // 0 — воскресенье, 1 — понедельник, ..., 6 — суббота
        const diffToMonday = (weekDay === 0 ? -6 : 1 - weekDay)
    
        const start = new Date(day)
        start.setDate(day.getDate() + diffToMonday)
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)

        this.week = { start, end };
    }

    getWeekPeriod(): Period {
        return this.week;
    }

    getWorkingWeekPeriod(): Period {
        const { start } = this.week;

        const end = new Date(start)
        end.setDate(start.getDate() + WEEK_DURATION.workingWeekDuration - 1)
        end.setHours(23, 59, 59, 999)

        return { start: new Date(start), end }
    }

    getWeekendPeriod(): Period {
        const start = new Date(this.week.start)
        start.setDate(start.getDate() + WEEK_DURATION.workingWeekDuration)
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + WEEK_DURATION.weekDuration - 1)
        end.setHours(23, 59, 59, 999)

        return { start, end }
    }
}