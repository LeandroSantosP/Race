import { Job } from "@/application/interfaces/Job";

export class JobLogTesting implements Job {
    name = "LogJob";

    async handle(data: any): Promise<any> {
        console.log(this.name, data, "leandro");
        return;
    }
}
