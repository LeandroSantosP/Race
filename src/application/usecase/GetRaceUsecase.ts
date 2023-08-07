import { Application } from "../interfaces/Application";
import { IRaceRepository } from "../repository/IRaceRepository";

export class GetRaceUsecase implements Application {
    constructor(private readonly raceRepository: IRaceRepository) {}
    async execute(input: Input): Promise<Output> {
        const race = await this.raceRepository.get(input.race_id);
        let output: Output = {
            race_id: race.id,
            ticket: race.getTicket(),
            status: race.status,
            race_price: race.getPrice(),
            race_Finished: race.raceFinished,
            driver: null,
            passenger: null,
        };
        const driver = race.getDriver();
        const passenger = race.getPassenger();

        if (driver) {
            output.driver = {
                cpf: driver.cpf,
            };
        }
        if (passenger) {
            output.passenger = {
                cpf: passenger.cpf,
                email: passenger.email,
            };
        }

        return output;
    }
}

type Input = {
    race_id: string;
};

type Output = {
    race_id: string;
    ticket: string;
    status: string;
    race_price: number;
    race_Finished: boolean;
    passenger: {
        email: string;
        cpf: string;
    } | null;
    driver: {
        cpf: string;
    } | null;
};
