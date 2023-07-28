import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("race", (table) => {
        table.uuid("id").primary();
        table.integer("sequence").notNullable();
        table.string("ticket").unique().notNullable();
        table.decimal("price").notNullable();
        table.string("status").notNullable();
        table.boolean("raceFinished").notNullable();
        table.timestamp("raceDate").notNullable();
        table.uuid("passenger_id").defaultTo(null);
        table.foreign("passenger_id").references("passenger.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("driver_id").defaultTo(null);
        table.foreign("driver_id").references("driver.id").onDelete("CASCADE").onUpdate("CASCADE");

        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("race");
}
