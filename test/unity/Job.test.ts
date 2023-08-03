import { JobLogTesting } from "@/infra/jobs/JobLogTesting";

test("Deve ser possível criar um job", async function () {
    const logJob = new JobLogTesting();

    expect(logJob.name).toBe("LogJob");
    await expect(logJob.handle({ test: "test" })).resolves.not.toThrow();
});
