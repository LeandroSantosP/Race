import { Transaction } from "@/domain/entity/Transaction";
import { IGatewayPayment } from "../service/IGatewayPayment";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { IRaceRepository } from "../repository/IRaceRepository";
import { Race } from "@/domain/entity/Race/Race";
import { Route } from "@/domain/entity/Race/Route";
import { IMediator } from "@/infra/mediator/IMediator";
import { RaceAppliedEvent } from "@/domain/event/RaceAppliedEvent";
import { CalculateRacePrice } from "@/domain/services/CalculateRacePrice";
import { IRoutesRepository } from "../repository/IRoutesRepository";

export class SubmitRaceUsecase {
    constructor(
        private readonly raceRepository: IRaceRepository,
        private readonly passengerRepository: IPassengerRepository,
        private readonly routesRepository: IRoutesRepository,
        private readonly mediator: IMediator
    ) {}

    async execute(input: Input): Promise<void> {
        const passenger = await this.passengerRepository.getByDocument(input.passenger_cpf);
        if (!passenger) throw new Error("Passenger not found");
        const sequence = await this.raceRepository.getSequence();

        const race = Race.create(sequence);

        race.setPrice(0);

        await this.raceRepository.save(race);

        const calculateRacePrice = new CalculateRacePrice();

        const routes = await Promise.all(
            input.routes_drives.map(async (routeData) => {
                const route = new Route(routeData.distance, routeData.date, race.id);
                await this.routesRepository.save(route);
                return route;
            })
        );

        const price = calculateRacePrice.calculate(routes);
        race.setPrice(price);
        await this.raceRepository.update(race);

        const raceAppliedEvent = new RaceAppliedEvent(
            race.id,
            input.creditCardToken,
            passenger.email.value,
            passenger.name
        );

        await this.mediator.publisher(raceAppliedEvent);
    }
}

type Input = {
    passenger_cpf: string;
    creditCardToken: string;
    routes_drives: Array<{
        distance: number;
        date: Date;
    }>;
};

type Output = {
    passengerName: string;
    ticket: string;
    status: string;
};
