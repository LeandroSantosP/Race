import { Queue } from "bullmq";
import { IQueue } from "@/application/interfaces/IQueue";

export class BullMqAdapter implements IQueue {
    constructor(readonly connection: any) {}

    createQueue(name: string): Queue {
        return new Queue(name, { connection: this.connection });
    }
}
