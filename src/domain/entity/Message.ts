import { randomUUID } from "crypto";
import { Email } from "./Passenger";

export class Message {
    private constructor(readonly id: string, readonly from: Email, readonly to: Email, readonly message: string) {}
    static create(from: string, to: string, message: string, id: string = randomUUID()) {
        return new Message(id, new Email(from), new Email(to), message);
    }
}
