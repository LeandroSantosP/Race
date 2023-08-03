import { JobLogTesting } from "@/infra/jobs/JobLogTesting";
import { QueueBackgroundJobController } from "@/infra/services/QueueBackgroundJobController";
import { BullMqAdapter } from "@/infra/services/BullMqAdapter";
import IORedis from "ioredis";
import RedisConfig from "@/config/RedisConfig";

const connection = new IORedis(RedisConfig.port, RedisConfig.host!, {
    password: RedisConfig.password,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
});

const bullmqAdapter = new BullMqAdapter(connection);

const queueBackgroundJob = QueueBackgroundJobController.getInstance(connection, bullmqAdapter);
test("Deve ser possível criar uma Fila de jobs.", async function () {
    queueBackgroundJob.jobs.push(new JobLogTesting());

    await queueBackgroundJob.publishOnQueue("LogJob", { test: "test" });
    queueBackgroundJob.process();
});

afterAll(async () => {
    connection.disconnect();
});
