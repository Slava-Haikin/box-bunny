import { CookingStyle, Period, WEEK_DURATION } from "@/types";

export default class Week {
    private week: Period;

    constructor(public day: Date) {
        const weekDay = day.getDay() // 0 — воскресенье, 1 — понедельник, ..., 6 — суббота
        const diffToMonday = (weekDay === 0 ? -6 : 1 - weekDay)
    
        const start = new Date(day)
        start.setDate(day.getDate() + diffToMonday)
        start.setUTCHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setUTCHours(23, 59, 59, 999)

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

    getWeekDates(): Date[] {
        const dates: Date[] = []
        const current = new Date(this.week.start)

        for (let i = 0; i < WEEK_DURATION.weekDuration; i++) {
            dates.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }

        return dates
    }

    getMenuPeriods(workingStyle: CookingStyle, weekendStyle: CookingStyle, weekendIncluded: boolean): Period[] {
        const deriveMenuUpdateInterval = (style: CookingStyle) => {
            switch (style) {
                case CookingStyle.Chief:
                return 1
                case CookingStyle.Regular:
                return 3
                default:
                return 7
            }
        }

        const splitDates = (dates: Date[], chunkSize: number): Date[][] => {
            const chunks: Date[][] = []
            for (let i = 0; i < dates.length; i += chunkSize) {
                chunks.push(dates.slice(i, i + chunkSize))
            }

            return chunks
        }

        const allDates = this.getWeekDates()
        const workingDays = allDates.slice(0, WEEK_DURATION.workingWeekDuration)
        const weekendDays = allDates.slice(WEEK_DURATION.workingWeekDuration)

        const workingMenuCount = Math.ceil(workingDays.length / deriveMenuUpdateInterval(workingStyle))
        const workingMenuLength = Math.ceil(workingDays.length / workingMenuCount)
        const workingChunks = splitDates(workingDays, workingMenuLength)

        const weekendMenuCount = Math.ceil(weekendDays.length / deriveMenuUpdateInterval(weekendStyle))
        const weekendMenuLength = Math.ceil(weekendDays.length / weekendMenuCount)
        const weekendChunks = weekendIncluded ? splitDates(weekendDays, weekendMenuLength) : [];

        return [...workingChunks, ...weekendChunks].map(chunk => ({
            start: chunk[0],
            end: new Date(chunk[chunk.length - 1].setUTCHours(23, 59, 59, 999)),
        }))
    }
}