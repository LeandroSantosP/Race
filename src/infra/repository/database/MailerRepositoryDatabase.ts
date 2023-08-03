import { IMailerRepository } from "@/application/repository/IMailerRepository";
import { knex_connection } from "@/database/knex";
import { Message } from "@/domain/entity/Message";
import { Knex } from "knex";

export class MailerRepositoryDatabase implements IMailerRepository {
    connection: Knex;

    constructor() {
        this.connection = knex_connection;
    }

    async save(message: Message): Promise<void> {
        await this.connection("message").insert({
            id: message.id,
            content: message.message,
            from: message.from.value,
            to: message.to.value,
        });
    }

    async get(id: string): Promise<Message> {
        const [messageData] = await this.connection("message").where({ id });

        if (!messageData) {
            throw new Error("Message not found");
        }

        return Message.create(messageData.from, messageData.to, messageData.content, messageData.id);
    }

    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
