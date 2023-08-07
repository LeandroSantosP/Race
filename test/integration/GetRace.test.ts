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

    const getRace = new GetRaceUsecase(raceRepository);

    const input = {
        race_id: race.id,
    };
    const output = await getRace.execute(input);

    expect(output).toBeInstanceOf(Object);
    expect(output.status).toEqual("rejected");
    expect(output.race_price).toEqual(100);
});

afterAll(async function () {
    await raceRepository.close();
});
