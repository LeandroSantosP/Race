import { Worker } from "bullmq";
import { IQueueBackgroundJobController } from "@/application/interfaces/IQueueBackgroundJobController";
import { IQueue } from "@/application/interfaces/IQueue";
import { Job } from "@/application/interfaces/Job";

export class QueueBackgroundJobController implements IQueueBackgroundJobController {
    private static instance: QueueBackgroundJobController;
    jobs: Job[] = [];

    private constructor(readonly connection: any, readonly queue: IQueue) {
        this.connection = connection;
    }

    static getInstance(RedisConnection: any, queue: IQueue): QueueBackgroundJobController {
        if (!QueueBackgroundJobController.instance) {
            QueueBackgroundJobController.instance = new QueueBackgroundJobController(RedisConnection, queue);
        }

        return this.instance;
    }

    async publishOnQueue(name: string, data: any) {
        const job = this.jobs.find((job) => job.name === name);
        if (!job) throw new Error("Job not found");
        const Queue = this.queue.createQueue(job.name);
        return await Queue.add(name, data);
    }

    process(): void {
        for (const job of this.jobs) {
            new Worker(
                job.name,
                async (jobData) => {
                    return job.handle(jobData.data);
                },
                { connection: this.connection }
            );
        }
    }
}