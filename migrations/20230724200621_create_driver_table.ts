import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("driver", (table) => {
        table.uuid("id").primary();
        table.string("driver_name").notNullable();
        table.integer("age").notNullable();
        table.string("cpf").notNullable();
        table.string("plate_car").unique().notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("driver");
}
