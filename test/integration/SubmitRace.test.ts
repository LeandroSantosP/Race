import { DriverAcceptHandler } from "@/application/handler/DriverAcceptHandler";
import { RaceAppliedHandler } from "@/application/handler/RaceAppliedHandler";
import { DriverAcceptUsecase } from "@/application/usecase/DriverAcceptUsecase";
import { FinishRaceUsecase } from "@/application/usecase/FinishRaceUsecase";
import { SubmitRaceUsecase } from "@/application/usecase/SubmitRaceUsecase";
import { Mediator } from "@/infra/mediator/Mediator";
import cleaner from "knex-cleaner";
import IORedis from "ioredis";
import { randomUUID } from "crypto";

import { PassengerRepositoryMemory } from "@/infra/repository/memory/PassengerRepositoryMemory";
import { DriverRepositoryMemory } from "@/infra/repository/memory/DriverRepositoryMemory";
import { RaceRepositoryMemory } from "@/infra/repository/memory/RaceRepositoryMemory";
import { RoutesRepositoryMemory } from "@/infra/repository/memory/RoutesRepositoryMemory";

import { TransactionRepositoryMemory } from "@/infra/repository/memory/TransactionRepositoryMemory";
import { MailerServiceAdapterMemory } from "@/infra/services/MailerServiceAdapterMemory";
import { StripeGatewayAdapterMemory } from "@/infra/services/StripeGatewayAdapterMemory";
import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";

import { DriverRepositoryDatabase } from "@/infra/repository/database/DriverRepositoryDatabase";
import { knex_connection } from "@/database/knex";
import { PassengerRepositoryDatabase } from "@/infra/repository/database/PassengerRepositoryDatabase";
import { RaceRepositoryDatabase } from "@/infra/repository/database/RaceRepositoryDatabase";
import { RoutesRepositoryDatabase } from "@/infra/repository/database/RouteRepositoryDatabase";
import { MailerRepositoryDatabase } from "@/infra/repository/database/MailerRepositoryDatabase";
import { MailerJobAdapterNodeMailer } from "@/infra/jobs";

import { QueueBackgroundJobController } from "@/infra/services/QueueBackgroundJobController";
import RedisConfig from "@/config/RedisConfig";
import { BullMqAdapter } from "@/infra/services/BullMqAdapter";

const driverRepository = new DriverRepositoryDatabase();
const passengerRepository = new PassengerRepositoryDatabase();
const routeRepository = new RoutesRepositoryDatabase();
const raceRepository = new RaceRepositoryDatabase();
const mailerRepository = new MailerRepositoryDatabase();

const RedisConnection = new IORedis(RedisConfig.port, RedisConfig.host!, {
    password: RedisConfig.password,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
});

const bullmqAdapter = new BullMqAdapter(RedisConnection);
const jobController = QueueBackgroundJobController.getInstance(RedisConnection);
jobController.jobs.push(new MailerJobAdapterNodeMailer(bullmqAdapter));

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

// is require execute this test alone
test("Deve fazer o fluxo completo de uma corrida", async function () {
    // repositories and services
    // const driverRepository = new DriverRepositoryMemory();
    // const passengerRepository = new PassengerRepositoryMemory();
    // const routeRepository = new RoutesRepositoryMemory();
    // const raceRepository = new RaceRepositoryMemory();
    const transactionRepository = new TransactionRepositoryMemory();
    const stripeGateway = new StripeGatewayAdapterMemory();
    const mailer = new MailerServiceAdapterMemory();
    // event handlers
    const driverAcceptHandler = new DriverAcceptHandler(jobController, mailerRepository);
    const raceAppliedHandler = new RaceAppliedHandler(
        stripeGateway,
        transactionRepository,
        raceRepository,
        passengerRepository
    );

    const mediator = new Mediator();

    mediator.register(raceAppliedHandler);
    mediator.register(driverAcceptHandler);

    const driver = Driver.create("John Doe", 36, "24851674279", "AAA-1234");
    await driverRepository.save(driver);

    const passenger = await Passenger.create("Matheus Doe", "matheus.doe@gmail.com", "senha123", 20, "75704900615");
    await passengerRepository.save(passenger);

    const submitRace = new SubmitRaceUsecase(raceRepository, passengerRepository, routeRepository, mediator);

    const SubmitRaceInput = {
        passenger_cpf: "75704900615",
        creditCardToken: randomUUID(),
        routes_drives: [
            {
                distance: 25,
                date: new Date("2021-01-01T10:00:00"),
            },
            {
                distance: 15,
                date: new Date("2021-01-08T10:00:00"),
            },
        ],
    };
    // Client submit race
    await submitRace.execute(SubmitRaceInput);

    expect(transactionRepository.transactions[0].status).toBe("approved");
    expect(transactionRepository.transactions[0].userEmail.value).toBe("matheus.doe@gmail.com");

    const [race] = await knex_connection("race").select("*");
    const race_id = race.id;
    // const race_id = raceRepository.races[0].id;

    const driverAccept = new DriverAcceptUsecase(raceRepository, driverRepository, mediator);

    const driverAcceptInput = {
        race_id,
        driver_cpf: "24851674279",
    };

    // Driver accept the race
    const output = await driverAccept.execute(driverAcceptInput);

    const driver_update = await raceRepository.get(race_id);

    expect(output.ticket).toBe("2023000001");
    expect(driver_update.getDriver()).toBeTruthy();

    // should finish a race

    const finishRace = new FinishRaceUsecase(raceRepository);

    const finishRaceInput = {
        race_id,
        date: new Date("2024-01-01"),
    };

    const currentRaceBefore = await raceRepository.get(race_id);
    expect(currentRaceBefore.raceFinished).toBeFalsy();

    const finishRaceOutput = await finishRace.execute(finishRaceInput);
    const currentRaceAfter = await raceRepository.get(race_id);

    expect(finishRaceOutput.totalPrice).toBe(56);
    expect(finishRaceOutput.race_time).toBeDefined();
    expect(currentRaceAfter.raceFinished).toBeTruthy();
});

afterAll(async () => {
    await passengerRepository.close();
    await driverRepository.close();
    await raceRepository.close();
    await routeRepository.close();
    await mailerRepository.close();
    RedisConnection.disconnect();
});
