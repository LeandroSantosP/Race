import "dotenv/config";
import IORedis from "ioredis";
import RedisConfig from "@/config/RedisConfig";

import { QueueBackgroundJobController } from "@/infra/services/QueueBackgroundJobController";
import { BullMqAdapter } from "./infra/services/BullMqAdapter";
import { MailerJobAdapterNodeMailer } from "./infra/jobs";

const connection = new IORedis(RedisConfig.port, RedisConfig.host!, {
    password: RedisConfig.password,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
});

const bullmqAdapter = new BullMqAdapter(connection);

export const queueBackgroundJob = QueueBackgroundJobController.getInstance(connection);

queueBackgroundJob.jobs.push(new MailerJobAdapterNodeMailer(bullmqAdapter));
queueBackgroundJob.process();
