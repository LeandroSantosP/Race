import { randomUUID } from "crypto";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("transaction", (table) => {
        table.uuid("tid").primary().defaultTo(randomUUID());
        table.string("status").notNullable();
        table.decimal("price").notNullable();
        table.uuid("race_id").notNullable();
        table.foreign("race_id").references("race.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("user_email").notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("transaction");
}
