import "dotenv/config";
import IORedis from "ioredis";
import RedisConfig from "@/config/RedisConfig";

import { QueueBackgroundJobController } from "@/infra/services/QueueBackgroundJobController";
import { BullMqAdapter } from "./infra/services/BullMqAdapter";
import { JobLogTesting } from "./infra/jobs/JobLogTesting";

const connection = new IORedis(RedisConfig.port, RedisConfig.host!, {
    password: RedisConfig.password,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
});
const bullmqAdapter = new BullMqAdapter(connection);

const queueBackgroundJob = QueueBackgroundJobController.getInstance(connection, bullmqAdapter);

queueBackgroundJob.jobs.push(new JobLogTesting());
queueBackgroundJob.add("LogJob", { test: "test" });
queueBackgroundJob.process();
