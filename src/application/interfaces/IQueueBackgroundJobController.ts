import { Job } from "@/domain/entity/Job";

export interface IQueueBackgroundJobController {
    jobs: Array<Job>;
    add(name: string, data: any): Promise<any>;
    process(): any;
}
