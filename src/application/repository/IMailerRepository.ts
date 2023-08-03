import { Message } from "@/domain/entity/Message";

export interface IMailerRepository {
    save(message: Message): Promise<void>;
    get(id: string): Promise<Message>;
}
