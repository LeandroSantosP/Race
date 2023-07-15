export class Route {
    NORMAL_TAX = 1.4;
    OVERNIGHT_TAX = 5;
    WEEKEND_TAX = 2.4;
    MIN_PRICE = 10;
    constructor(readonly distance: number, readonly date: Date) {}

    isWeekend(): boolean {
        const weekDay = this.date.getDay();
        return weekDay === 0 || weekDay === 6;
    }

    isOverNight() {
        const hour = this.date.getHours();
        return hour >= 19;
    }

    protected getSubTotal() {
        let normalSubTotal = this.distance * this.NORMAL_TAX;
        let weekendSubTotal = this.distance * this.WEEKEND_TAX;

        return {
            normalSubTotal,
            weekendSubTotal,
        };
    }

    calculate() {
        const { normalSubTotal, weekendSubTotal } = this.getSubTotal();
        let total = 0;

        if (this.isWeekend() && !this.isOverNight()) {
            return (total += this.distance * this.WEEKEND_TAX);
        }

        if (this.isWeekend() && this.isOverNight()) {
            return (total += weekendSubTotal + this.OVERNIGHT_TAX);
        }

        if (this.isOverNight()) {
            return (total += normalSubTotal + this.OVERNIGHT_TAX);
        }

        return normalSubTotal;
    }
}
