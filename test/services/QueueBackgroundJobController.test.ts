import { JobLogTesting } from "@/infra/jobs/JobLogTesting";
import { QueueBackgroundJobController } from "@/infra/services/QueueBackgroundJobController";
import { BullMqAdapter } from "@/infra/services/BullMqAdapter";
import IORedis from "ioredis";
import RedisConfig from "@/config/RedisConfig";
import { MailerJobAdapterNodeMailer } from "@/infra/jobs";
import { handleMailerData } from "@/infra/jobs/MailerJobAdapterNodeMailer";

const connection = new IORedis(RedisConfig.port, RedisConfig.host!, {
    password: RedisConfig.password,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
});

const bullmqAdapter = new BullMqAdapter(connection);

const queueBackgroundJob = QueueBackgroundJobController.getInstance(connection);

test("Deve ser possível criar uma Fila de jobs.", async function () {
    queueBackgroundJob.jobs.push(new JobLogTesting(bullmqAdapter), new MailerJobAdapterNodeMailer(bullmqAdapter));
    // await queueBackgroundJob.publishOnQueue<{ test: string }>("LogJob", { test: "test" });
    await queueBackgroundJob.publishOnQueue<handleMailerData>("MailerJob", {
        from: "laisha85@ethereal.email",
        message: "Hello world",
        to: "test@gmail.com",
    });
    queueBackgroundJob.process();
});
