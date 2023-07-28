import { Race } from "@/domain/entity/Race/Race";

export interface IRaceRepository {
    save(race: Race): Promise<void>;
    get(id: string): Promise<Race>;

    getSequence(): Promise<number>;
    update(race: Race): Promise<void>;
}
