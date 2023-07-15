import { Transaction } from "@/domain/entity/Transaction";
import { IGatewayPayment } from "../service/IGatewayPayment";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { IRaceRepository } from "../repository/IRaceRepository";
import { ITransactionRepository } from "../repository/ITransactionRepository";
import { Race } from "@/domain/entity/Race/Race";
import { Route } from "@/domain/entity/Race/Route";
import { IMediator } from "@/infra/mediator/IMediator";
import { RaceAppliedEvent } from "@/domain/event/RaceAppliedEvent";

export class SubmitRaceUsecase {
    constructor(
        private readonly raceRepository: IRaceRepository,
        private readonly passengerRepository: IPassengerRepository,
        private readonly mediator: IMediator
    ) {}

    async execute(input: Input): Promise<void> {
        const passenger = await this.passengerRepository.getByDocument(input.passenger_cpf);
        if (!passenger) throw new Error("Passenger not found");
        const sequence = await this.raceRepository.getSequence();

        const race = Race.create(sequence);

        for (const route of input.routes_drives) {
            race.addRoutes(new Route(route.distance, route.date));
        }

        await this.raceRepository.save(race);

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
