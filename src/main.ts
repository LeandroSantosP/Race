import "dotenv/config";
import { Routes } from "./infra/api/Routes";
import { ExpressAdapter } from "./infra/api/ExpressAdapter";
import { DriverRepositoryDatabase } from "./infra/repository/database/DriverRepositoryDatabase";
import { queueBackgroundJob } from "./QueueBull";
import { DriverAcceptHandler } from "./application/handler/DriverAcceptHandler";
import { RaceAppliedHandler } from "./application/handler/RaceAppliedHandler";
import { Mediator } from "./infra/mediator/Mediator";
import { MailerRepositoryDatabase } from "./infra/repository/database/MailerRepositoryDatabase";
import { PassengerRepositoryDatabase } from "./infra/repository/database/PassengerRepositoryDatabase";
import { RaceRepositoryDatabase } from "./infra/repository/database/RaceRepositoryDatabase";
import { RoutesRepositoryDatabase } from "./infra/repository/database/RouteRepositoryDatabase";
import { TransactionDatabaseRepository } from "./infra/repository/database/TransactionDatabaseRepository";
import { StripeGatewayAdapterMemory } from "./infra/services/StripeGatewayAdapterMemory";

const driverRepository = new DriverRepositoryDatabase();

const raceRepository = new RaceRepositoryDatabase();
const routesRepository = new RoutesRepositoryDatabase();
const mailerRepository = new MailerRepositoryDatabase();
const passengerRepository = new PassengerRepositoryDatabase();

const transactionRepository = new TransactionDatabaseRepository();
const stripeGateway = new StripeGatewayAdapterMemory();

const driverAcceptHandler = new DriverAcceptHandler(queueBackgroundJob, mailerRepository);
const raceAppliedHandler = new RaceAppliedHandler(
    stripeGateway,
    transactionRepository,
    raceRepository,
    passengerRepository
);

const mediator = new Mediator();

mediator.register(raceAppliedHandler);
mediator.register(driverAcceptHandler);

const httpServer = new ExpressAdapter();
const routes = new Routes(httpServer);

routes.register("mediator", mediator);
routes.register("raceRepository", raceRepository);
routes.register("driverRepository", driverRepository);
routes.register("routesRepository", routesRepository);
routes.register("passengerRepository", passengerRepository);
routes.register("mailerRepository", mailerRepository);
routes.register("stripeGateway", stripeGateway);

httpServer.listen(3001);
