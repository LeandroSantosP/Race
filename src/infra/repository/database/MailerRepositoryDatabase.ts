import { IMailerRepository, message } from "@/application/repository/IMailerRepository";
import { knex_connection } from "@/database/knex";
import { randomUUID } from "crypto";
import { Knex } from "knex";

export class mailerRepositoryDatabase implements IMailerRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }
    async save(message: message): Promise<void> {
        await this.connection("message").insert({
            id: randomUUID(),
            content: message.message,
            from: message.from,
            to: message.to,
        });
    }
}
