import { IRaceRepository } from "../repository/IRaceRepository";

export class FinishRaceUsecase {
    constructor(private readonly raceRepository: IRaceRepository) {}

    async execute(input: Input): Promise<Output> {
        const race = await this.raceRepository.get(input.race_id);

        const race_time = race.fishedRace(input.date);
        const totalPrice = race.getPrice();
        await this.raceRepository.update(race);
        return {
            totalPrice,
            race_time,
        };
    }
}

type Input = {
    date: Date;
    race_id: string;
};

type Output = {
    totalPrice: number;
    race_time: number;
};
