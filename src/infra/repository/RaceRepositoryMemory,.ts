import { IRaceRepository } from "@/application/repository/IRaceRepository";
import { Race } from "@/domain/entity/Race/Race";

export class RaceRepositoryMemory implements IRaceRepository {
    races: Race[] = [];
    async save(race: Race): Promise<void> {
        this.races.push(race);
    }
    async get(id: string): Promise<Race> {
        const race = this.races.find((race) => race.id === id);
        if (!race) throw new Error("Race not found");
        return race;
    }

    async getSequence(): Promise<number> {
        return this.races.length + 1;
    }

    async update(race: Race): Promise<void> {
        const currentRace = this.races.indexOf(race);
        if (currentRace === -1) throw new Error("Race not found");
        this.races[currentRace] = race;
    }
}
