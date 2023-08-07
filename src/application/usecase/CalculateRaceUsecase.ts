import { Route } from "@/domain/entity/Race/Route";
import { CalculateRacePrice } from "@/domain/services/CalculateRacePrice";
import { Application } from "../interfaces/Application";

export class CalculateRaceUsecase implements Application {
    constructor() {}

    async execute(input: Input): Promise<Output> {
        const calculateRacePrice = new CalculateRacePrice();

        const routes = input.routes_drives.map((route) => new Route(route.distance, new Date(route.date)));

        const price = calculateRacePrice.calculate(routes);

        return { price };
    }
}

type Input = {
    routes_drives: {
        distance: number;
        date: Date;
    }[];
};

type Output = {
    price: number;
};
