import { randomUUID } from "crypto";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("route", (table) => {
        table.uuid("id").primary().defaultTo(randomUUID());
        table.decimal("distance").notNullable();
        table.uuid("race_id");
        table.foreign("race_id").references("race.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("route");
}
