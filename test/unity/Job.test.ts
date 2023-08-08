import { IQueue } from "@/application/interfaces/IQueue";
import { JobLogTesting } from "@/infra/jobs/JobLogTesting";
const mockQueue: IQueue<any, any> = {
    createQueue(queueName: string) {},
    createWorker: function (queueName: string, handler: Function) {
        throw new Error("Function not implemented.");
    },
};
test("Deve ser possível criar um job", async function () {
    const logJob = new JobLogTesting(mockQueue);

    expect(logJob.name).toBe("LogJob");
    await expect(logJob.handle({ test: "test" })).resolves.not.toThrow();
});
