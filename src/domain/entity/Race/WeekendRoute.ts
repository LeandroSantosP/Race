import { Route } from "./Route";

export class WeekendRoute extends Route {
    getTex(): number {
        if (this.isWeekend() && !this.isOverNight()) {
            return this.distance * this.WEEKEND_TAX;
        }
        throw new Error("Must be weekend and not overnight");
    }
}
