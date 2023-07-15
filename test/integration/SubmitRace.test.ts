import { RaceAppliedHandler } from "@/application/handler/RaceAppliedHandler";
import { DriverAcceptUsecase } from "@/application/usecase/DriverAcceptUsecase";
import { SubmitRaceUsecase } from "@/application/usecase/SubmitRaceUsecase";
import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";
import { Mediator } from "@/infra/mediator/Mediator";
import { DriverRepositoryMemory } from "@/infra/repository/DriverRepositoryMemory";
import { PassengerRepositoryMemory } from "@/infra/repository/PassengerRepositoryMemory";
import { RaceRepositoryMemory } from "@/infra/repository/RaceRepositoryMemory,";
import { TransactionRepositoryMemory } from "@/infra/repository/TransactionRepositoryMemory";
import { StripeGatewayAdapterMemory } from "@/infra/services/StripeGatewayAdapterMemory";
import { randomUUID } from "crypto";

test("Deve fazer o fluxo para aceitar uma corrida", async function () {
    const driverRepository = new DriverRepositoryMemory();

    const driver = Driver.create("John Doe", 36, "24851674279", "AAA-1234");
    await driverRepository.save(driver);

    const raceRepository = new RaceRepositoryMemory();
    const stripeGateway = new StripeGatewayAdapterMemory();
    const transactionRepository = new TransactionRepositoryMemory();
    const passengerRepository = new PassengerRepositoryMemory();

    const raceAppliedHandler = new RaceAppliedHandler(
        stripeGateway,
        transactionRepository,
        raceRepository,
        passengerRepository
    );

    const mediator = new Mediator();

    mediator.register(raceAppliedHandler);

    const passenger = await Passenger.create("Michael Doe", "michael.doe@gmail.com", "senha123", 20, "75704900615");
    await passengerRepository.save(passenger);

    const submitRace = new SubmitRaceUsecase(raceRepository, passengerRepository, mediator);

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

    await submitRace.execute(SubmitRaceInput);

    expect(transactionRepository.transactions[0].status).toBe("approved");
    expect(transactionRepository.transactions[0].userEmail.value).toBe("michael.doe@gmail.com");
    expect(raceRepository.races[0].getPassenger()).not.toBeNull();

    const driverAccept = new DriverAcceptUsecase(raceRepository, driverRepository, passengerRepository);
    const race_id = raceRepository.races[0].id;

    const driverAcceptInput = {
        race_id,
        driver_cpf: "24851674279",
    };

    const output = await driverAccept.execute(driverAcceptInput);

    expect(output.ticket).toBe("2023000001");
    expect(raceRepository.races[0].getDriver()).toBeTruthy();
});
