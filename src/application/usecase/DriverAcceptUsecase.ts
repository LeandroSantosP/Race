import { IDriverRepository } from "../repository/IDriverRepository";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { IRaceRepository } from "../repository/IRaceRepository";

export class DriverAcceptUsecase {
    constructor(
        private readonly raceRepository: IRaceRepository,
        private readonly driverRepository: IDriverRepository,
        private readonly passengerRepository: IPassengerRepository
    ) {}

    async execute(input: Input): Promise<Output> {
        const race = await this.raceRepository.get(input.race_id);
        const driver = await this.driverRepository.getByCpf(input.driver_cpf);
        race.matchDriver(driver);
        const ticket = race.getTicket();
        await this.raceRepository.update(race);
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
