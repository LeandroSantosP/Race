import { Job } from "./Job";

export interface IQueueBackgroundJobController {
    jobs: Array<Job>;
    publishOnQueue(name: string, data: any): Promise<any>;
    process(): any;
}
