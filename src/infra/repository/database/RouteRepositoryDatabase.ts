import { IRoutesRepository } from "@/application/repository/IRoutesRepository";
import { knex_connection } from "@/database/knex";
import { Route } from "@/domain/entity/Race/Route";
import { randomUUID } from "crypto";
import { Knex } from "knex";

export class RoutesRepositoryDatabase implements IRoutesRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }
    async save(route: Route): Promise<void> {
        await this.connection("route").insert({
            id: randomUUID(),
            distance: route.distance,
            created_at: route.date,
            race_id: route.race_id,
        });
    }
    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
