import { IQueueBackgroundJobController } from "@/application/interfaces/IQueueBackgroundJobController";
import { Job } from "@/application/interfaces/Job";

import { Worker } from "bullmq";

export class QueueBackgroundJobController implements IQueueBackgroundJobController {
    private static instance: QueueBackgroundJobController;
    jobs: Job[] = [];

    private constructor(readonly connection: any) {
        this.connection = connection;
    }

    static getInstance(RedisConnection: any): QueueBackgroundJobController {
        if (!QueueBackgroundJobController.instance) {
            QueueBackgroundJobController.instance = new QueueBackgroundJobController(RedisConnection);
        }

        return this.instance;
    }

    async publishOnQueue<Data>(name: string, data: Data) {
        const job = this.jobs.find((job) => job.name === name);
        if (!job) throw new Error("Job not found");

        const Queue = job.queue;

        return await Queue.add(name, data);
    }

    process() {
        for (const job of this.jobs) {
            new Worker(
                job.name,
                async (context) => {
                    await job.handle(context.data);
                },
                { connection: this.connection }
            );
        }
    }
}
