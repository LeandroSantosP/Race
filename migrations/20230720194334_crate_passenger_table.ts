import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("passenger", (table) => {
        table.uuid("id").primary();
        table.string("passenger_name").notNullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.integer("age").notNullable();
        table.string("cpf").notNullable();
        table.integer("salt").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("passenger");
}
