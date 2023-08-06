import { knex_connection } from "@/database/knex";
import cleaner from "knex-cleaner";

import { Race } from "@/domain/entity/Race/Race";
import { RaceRepositoryDatabase } from "@/infra/repository/database/RaceRepositoryDatabase";

const repo = new RaceRepositoryDatabase();

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("Deve ser possível fazer um inset de uma nova corrida", async function () {
    const race = Race.create(1);
    race.setPrice(0);
    await repo.save(race);
});

test("Deve ser possível obter uma corrida.", async function () {
    const race = Race.create(1);
    race.setPrice(0);

    await repo.save(race);
    const output = await repo.get(race.id);

    expect(output).toBeDefined();
});

test("Deve ser possível atualizar uma corrida", async function () {
    const race = Race.create(1);
    race.setPrice(0);
    await repo.save(race);

    race.fishedRace(new Date("2023-06-21"));
    race.setStatus("waiting_driver");

    await repo.update(race);

    const output = await repo.get(race.id);

    expect(output.raceFinished).toBeTruthy();
    expect(output.status).toBe("waiting_driver");
});

test("Deve Obter uma race", async function () {});

afterAll(async () => {
    await repo.close();
});
