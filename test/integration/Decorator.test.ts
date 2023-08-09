import { LodDecorator } from "@/application/decorator/LogDecorator";
import { GetRaceUsecase } from "@/application/usecase/GetRaceUsecase";
import { knex_connection } from "@/database/knex";
import { Race } from "@/domain/entity/Race/Race";
import { RaceRepositoryDatabase } from "@/infra/repository/database/RaceRepositoryDatabase";

const raceRepository = new RaceRepositoryDatabase();

import cleaner from "knex-cleaner";

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("deve ser possível obter a uma race", async function () {
    const race = Race.create(11);
    race.setPrice(100);
    race.setStatus("rejected");

    await raceRepository.save(race);

    const getRace = new LodDecorator(new GetRaceUsecase(raceRepository));
    const input = {
        race_id: race.id,
    };
    await getRace.execute(input);
});

afterAll(async function () {
    await raceRepository.close();
});
