import express from "express";
import { Mediator } from "./infra/mediator/Mediator";
import { DriverAcceptHandler } from "./application/handler/DriverAcceptHandler";
import { RaceAppliedHandler } from "./application/handler/RaceAppliedHandler";
import { MailerRepositoryDatabase } from "./infra/repository/database/MailerRepositoryDatabase";
import { CalculateRaceUsecase } from "./application/usecase/CalculateRaceUsecase";
import { CreateDriverUsecase } from "./application/usecase/CreateDriverUsecase";
import { DriverRepositoryDatabase } from "./infra/repository/database/DriverRepositoryDatabase";
import { GetDriverUsecase } from "./application/usecase/GetDriverUsecase";
import { CreatePassengerUsecase } from "./application/usecase/CreatePassengerUsecase";
import { PassengerRepositoryDatabase } from "./infra/repository/database/PassengerRepositoryDatabase";
import { FinishRaceUsecase } from "./application/usecase/FinishRaceUsecase";
import { RaceRepositoryDatabase } from "./infra/repository/database/RaceRepositoryDatabase";
import { SubmitRaceUsecase } from "./application/usecase/SubmitRaceUsecase";
import { RoutesRepositoryDatabase } from "./infra/repository/database/RouteRepositoryDatabase";
import { TransactionRepositoryMemory } from "./infra/repository/TransactionRepositoryMemory";
import { MailerServiceAdapterMemory } from "./infra/services/MailerServiceAdapterMemory";
import { StripeGatewayAdapterMemory } from "./infra/services/StripeGatewayAdapterMemory";

const app = express();

app.use(express.json());

// const driverAcceptHandler = new DriverAcceptHandler(mailer, mailerRepository);
// const raceAppliedHandler = new RaceAppliedHandler(
//     stripeGateway,
//     transactionRepository,
//     raceRepository,
//     passengerRepository
// );

const raceRepository = new RaceRepositoryDatabase();
const routesRepository = new RoutesRepositoryDatabase();
const driverRepository = new DriverRepositoryDatabase();
const mailerRepository = new MailerRepositoryDatabase();
const passengerRepository = new PassengerRepositoryDatabase();

const transactionRepository = new TransactionRepositoryMemory();
const stripeGateway = new StripeGatewayAdapterMemory();
const mailer = new MailerServiceAdapterMemory();

const driverAcceptHandler = new DriverAcceptHandler(mailer, mailerRepository);
const raceAppliedHandler = new RaceAppliedHandler(
    stripeGateway,
    transactionRepository,
    raceRepository,
    passengerRepository
);

const mediator = new Mediator();

mediator.register(raceAppliedHandler);
mediator.register(driverAcceptHandler);

app.post("/calculate-race", async (req, res) => {
    const calculateRace = new CalculateRaceUsecase();

    const output = await calculateRace.execute(req.body);
    return res.json(output);
});

app.post("/create-driver", async (req, res) => {
    const createDriver = new CreateDriverUsecase(driverRepository);
    await createDriver.execute(req.body);

    return res.send();
});

app.get("/driver-by-cpf/:cpf", async (req, res) => {
    const getDriver = new GetDriverUsecase(driverRepository);
    const output = await getDriver.execute(req.params.cpf);
    return res.json(output);
});

app.post("/create-passenger", async (req, res) => {
    const createPassenger = new CreatePassengerUsecase(passengerRepository);
    await createPassenger.execute(req.body);
    return res.send();
});

app.post("/finished-race", async (req, res) => {
    const createDriver = new FinishRaceUsecase(raceRepository);

    const output = await createDriver.execute(req.body);
    return res.json(output);
});

app.post("/submit-race", async (req, res) => {
    const createRace = new SubmitRaceUsecase(raceRepository, passengerRepository, routesRepository, mediator);

    await createRace.execute(req.body);

    return res.send();
});

app.listen(3333, () => console.log("Server is running!"));
