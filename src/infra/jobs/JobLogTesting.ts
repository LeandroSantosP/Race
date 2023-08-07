import { IQueue } from "@/application/interfaces/IQueue";
import { Job } from "@/application/interfaces/Job";

export class JobLogTesting implements Job {
    queue: any;
    name = "LogJob";

    constructor(queue: IQueue) {
        this.queue = queue.createQueue(this.name);
    }

    async handle(data: any): Promise<any> {
        console.log(this.name, data, "leandro");
        return;
    }
}
