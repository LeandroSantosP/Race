import { DriverAcceptHandler } from "@/application/handler/DriverAcceptHandler";
import { RaceAppliedHandler } from "@/application/handler/RaceAppliedHandler";
import { DriverAcceptUsecase } from "@/application/usecase/DriverAcceptUsecase";
import { FinishRaceUsecase } from "@/application/usecase/FinishRaceUsecase";
import { SubmitRaceUsecase } from "@/application/usecase/SubmitRaceUsecase";
import { Mediator } from "@/infra/mediator/Mediator";
import { PassengerRepositoryMemory } from "@/infra/repository/PassengerRepositoryMemory";
import { DriverRepositoryMemory } from "@/infra/repository/memory/DriverRepositoryMemory";

import { RaceRepositoryMemory } from "@/infra/repository/RaceRepositoryMemory,";
import { TransactionRepositoryMemory } from "@/infra/repository/TransactionRepositoryMemory";
import { MailerServiceAdapterMemory } from "@/infra/services/MailerServiceAdapterMemory";
import { StripeGatewayAdapterMemory } from "@/infra/services/StripeGatewayAdapterMemory";
import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";
import { randomUUID } from "crypto";
import { DriverRepositoryDatabase } from "@/infra/repository/database/DriverRepositoryDatabase";
import cleaner from "knex-cleaner";
import { knex_connection } from "@/database/knex";
import { PassengerRepositoryDatabase } from "@/infra/repository/database/PassengerRepositoryDatabase";
import { RaceRepositoryDatabase } from "@/infra/repository/database/RaceRepositoryDatabase";
import { RoutesRepositoryDatabase } from "@/infra/repository/database/RouteRepositoryDatabase";
import { RoutesRepositoryMemory } from "@/infra/repository/memory/RoutesRepositoryMemory";

const driverRepository = new DriverRepositoryDatabase();
const passengerRepository = new PassengerRepositoryDatabase();
const routeRepository = new RoutesRepositoryDatabase();
const raceRepository = new RaceRepositoryDatabase();

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("Deve fazer o fluxo completo de uma corrida", async function () {
    // repositories
    // const driverRepository = new DriverRepositoryMemory();
    // const passengerRepository = new PassengerRepositoryMemory();

    const routeRepository = new RoutesRepositoryMemory();
    const raceRepository = new RaceRepositoryMemory();
    const transactionRepository = new TransactionRepositoryMemory();

    const driver = Driver.create("John Doe", 36, "24851674279", "AAA-1234");
    await driverRepository.save(driver);

    const stripeGateway = new StripeGatewayAdapterMemory();

    const raceAppliedHandler = new RaceAppliedHandler(
        stripeGateway,
        transactionRepository,
        raceRepository,
        passengerRepository
    );

    const mailer = new MailerServiceAdapterMemory();

    const driverAcceptHandler = new DriverAcceptHandler(mailer);

    const mediator = new Mediator();

    mediator.register(raceAppliedHandler);
    mediator.register(driverAcceptHandler);

    const passenger = await Passenger.create("João Doe", "joao.doe@gmail.com", "senha123", 20, "75704900615");
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
    expect(transactionRepository.transactions[0].userEmail.value).toBe("joao.doe@gmail.com");
    expect(raceRepository.races[0].getPassenger()).not.toBeNull();

    const driverAccept = new DriverAcceptUsecase(raceRepository, driverRepository, mediator);
    const race_id = raceRepository.races[0].id;

    const driverAcceptInput = {
        race_id,
        driver_cpf: "24851674279",
    };

    // Driver accept the race
    const output = await driverAccept.execute(driverAcceptInput);

    expect(output.ticket).toBe("2023000001");
    expect(raceRepository.races[0].getDriver()).toBeTruthy();

    expect(mailer.messages).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                message:
                    "Ola sua corrida foi aceita com secusse pelo motorista John Doe, esta a caminho..., PLACA DE CARRO: AAA-1234",
            }),
        ])
    );

    // should finish a race

    const finishRace = new FinishRaceUsecase(raceRepository);

    const finishRaceInput = {
        race_id,
        date: new Date("2024-01-01"),
    };

    expect(raceRepository.races[0].raceFinished).toBeFalsy();
    const finishRaceOutput = await finishRace.execute(finishRaceInput);

    expect(finishRaceOutput.totalPrice).toBe(56);
    expect(finishRaceOutput.race_time).toBeDefined();
    expect(raceRepository.races[0].raceFinished).toBeTruthy();
});

afterAll(async () => {
    await passengerRepository.close();
    await driverRepository.close();
});
