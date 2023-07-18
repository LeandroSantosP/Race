import { IMediator } from "@/infra/mediator/IMediator";
import { IDriverRepository } from "../repository/IDriverRepository";
import { IRaceRepository } from "../repository/IRaceRepository";
import { DriverAcceptEvent } from "@/domain/event/DriverAcceptEvent";

export class DriverAcceptUsecase {
    constructor(
        private readonly raceRepository: IRaceRepository,
        private readonly driverRepository: IDriverRepository,
        private readonly mediator: IMediator
    ) {}

    async execute(input: Input): Promise<Output> {
        const race = await this.raceRepository.get(input.race_id);
        const driver = await this.driverRepository.getByCpf(input.driver_cpf);
        race.matchDriver(driver);
        const ticket = race.getTicket();
        await this.raceRepository.update(race);

        const driverAcceptEvent = new DriverAcceptEvent(
            race.getPassenger()!.email,
            driver.name,
            driver.plate_car.getValue()
        );

        await this.mediator.publisher(driverAcceptEvent);

        return {
            ticket,
        };
    }
}

type Input = {
    race_id: string;
    driver_cpf: string;
};

type Output = {
    ticket: string;
};
