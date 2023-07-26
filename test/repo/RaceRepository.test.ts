import { knex_connection } from "@/database/knex";
import cleaner from "knex-cleaner";

import { Race } from "@/domain/entity/Race/Race";
import { Route } from "@/domain/entity/Race/Route";
import { RaceRepositoryDatabase } from "@/infra/repository/database/RaceRepositoryDatabase";

const repo = new RaceRepositoryDatabase();

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("Deve ser possível fazer um inset de uma nova corrida", async function () {
    const routes_drives = [
        {
            distance: 44,
            date: new Date("2021-01-10T10:00:00"),
        },
    ];
    const race = Race.create(1);
    for (const route_drive of routes_drives) {
        race.addRoutes(new Route(route_drive.distance, route_drive.date));
    }
    await repo.save(race);
});

afterAll(async () => {
    await repo.close();
});
