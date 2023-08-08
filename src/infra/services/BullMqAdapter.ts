import { Queue, Worker } from "bullmq";
import { IQueue } from "@/application/interfaces/IQueue";

export class BullMqAdapter implements IQueue<Queue, Worker> {
    constructor(readonly connection: any) {}

    createQueue(name: string): Queue {
        return new Queue(name, { connection: this.connection });
    }
    createWorker(queueName: string, handle: (data: any) => Promise<any>, opts?: any) {
        const worker = new Worker(
            queueName,
            async (context) => {
                return await handle(context.data);
            },
            { connection: this.connection, ...opts }
        );

        worker.on("failed", async (e) => console.log(e));
        return worker;
    }
}
