import { Route } from "../entity/Race/Route";

export class CalculateRacePrice {
    constructor() {}

    calculate(routes: Route[]) {
        const price = routes.reduce((acc, route) => {
            return (acc += route.calculate());
        }, 0);

        if (price <= 15) {
            return 15;
        }

        return price;
    }
}
