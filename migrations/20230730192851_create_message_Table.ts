import { randomUUID } from "crypto";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("message", (table) => {
        table.uuid("id").primary().defaultTo(randomUUID());
        table.string("content").notNullable();
        table.string("from").notNullable();
        table.string("to").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("message");
}
