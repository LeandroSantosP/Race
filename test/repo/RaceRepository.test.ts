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

    await repo.save(race);
});

test("Deve Obter uma race", async function () {});

afterAll(async () => {
    await repo.close();
});
