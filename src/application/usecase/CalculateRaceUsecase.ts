import { Race } from "@/domain/entity/Race/Race";
import { Route } from "@/domain/entity/Race/Route";

export class CalculateRaceUsecase {
    constructor() {}

    async execute(input: Input): Promise<Output> {
        const race = Race.create(1);
        for (const route_drive of input.routes_drives) {
            race.addRoutes(new Route(route_drive.distance, route_drive.date));
        }
        const price = race.getPrice();
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
