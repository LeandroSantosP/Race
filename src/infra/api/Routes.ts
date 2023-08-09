import { createBullBoard } from "bull-board";
import { BullMQAdapter } from "bull-board/bullMQAdapter";
import { queueBackgroundJob } from "@/QueueBull";
import { DriverAcceptHandler } from "@/application/handler/DriverAcceptHandler";
import { RaceAppliedHandler } from "@/application/handler/RaceAppliedHandler";
import { CalculateRaceUsecase } from "@/application/usecase/CalculateRaceUsecase";
import { CreateDriverUsecase } from "@/application/usecase/CreateDriverUsecase";
import { CreatePassengerUsecase } from "@/application/usecase/CreatePassengerUsecase";
import { DriverAcceptUsecase } from "@/application/usecase/DriverAcceptUsecase";
import { FinishRaceUsecase } from "@/application/usecase/FinishRaceUsecase";
import { GetDriverUsecase } from "@/application/usecase/GetDriverUsecase";
import { SubmitRaceUsecase } from "@/application/usecase/SubmitRaceUsecase";
import { Mediator } from "../mediator/Mediator";
import { MailerRepositoryDatabase } from "../repository/database/MailerRepositoryDatabase";
import { PassengerRepositoryDatabase } from "../repository/database/PassengerRepositoryDatabase";
import { RaceRepositoryDatabase } from "../repository/database/RaceRepositoryDatabase";
import { RoutesRepositoryDatabase } from "../repository/database/RouteRepositoryDatabase";
import { TransactionDatabaseRepository } from "../repository/database/TransactionDatabaseRepository";
import { StripeGatewayAdapterMemory } from "../services/StripeGatewayAdapterMemory";
import { HttpServer } from "./HttpServer";

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

const queueRegister = queueBackgroundJob.jobs.map((job) => new BullMQAdapter(job.queue, { readOnlyMode: true }));

const { router } = createBullBoard(queueRegister);

export class Routes {
    private dependencies: { [key: string]: any };
    constructor(readonly httpServer: HttpServer) {
        this.dependencies = {};
        this.loadRoutes();
    }

    register(dependencyName: string, dependency: any) {
        this.dependencies[dependencyName] = dependency;
    }

    private loadRoutes() {
        this.httpServer.on(
            "use",
            "/queues",
            (params: any, body: any, next: Function) => {
                next();
            },
            router
        );

        this.httpServer.on("post", "/calculate-race", async (params: any, body: any) => {
            const calculateRace = new CalculateRaceUsecase();

            const output = await calculateRace.execute(body);
            return output;
        });

        this.httpServer.on("post", "/create-driver", async (params: any, body: any) => {
            const driverRepository = this.dependencies["driverRepository"];
            const createDriver = new CreateDriverUsecase(driverRepository);
            await createDriver.execute(body);
        });

        this.httpServer.on("get", "/driver-by-cpf/:cpf", async (params: any, body: any) => {
            const driverRepository = this.dependencies["driverRepository"];
            const getDriver = new GetDriverUsecase(driverRepository);
            const output = await getDriver.execute(params.cpf);
            return output;
        });

        this.httpServer.on("post", "/create-passenger", async (params: any, body: any) => {
            const createPassenger = new CreatePassengerUsecase(passengerRepository);
            await createPassenger.execute(body);
            return;
        });

        this.httpServer.on("post", "/create-driver", async (params: any, body: any) => {
            const driverRepository = this.dependencies["driverRepository"];
            const createDriver = new CreateDriverUsecase(driverRepository);
            await createDriver.execute(body);
            return;
        });

        this.httpServer.on("post", "/finished-race", async (params: any, body: any) => {
            const createDriver = new FinishRaceUsecase(raceRepository);

            const output = await createDriver.execute(body);
            return output;
        });

        this.httpServer.on("post", "/submit-race", async (params: any, body: any) => {
            const submitRace = new SubmitRaceUsecase(raceRepository, passengerRepository, routesRepository, mediator);

            await submitRace.execute(body);

            return;
        });

        this.httpServer.on("post", "/driver-accept", async (params: any, body: any) => {
            const driverRepository = this.dependencies["driverRepository"];
            const driverAccept = new DriverAcceptUsecase(raceRepository, driverRepository, mediator);
            const output = await driverAccept.execute(body);

            return output;
        });
    }
}
