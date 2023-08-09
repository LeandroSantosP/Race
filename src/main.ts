import "dotenv/config";
import { Routes } from "./infra/api/Routes";
import { ExpressAdapter } from "./infra/api/ExpressAdapter";
import { DriverRepositoryDatabase } from "./infra/repository/database/DriverRepositoryDatabase";

const driverRepository = new DriverRepositoryDatabase();
const httpServer = new ExpressAdapter();
const routes = new Routes(httpServer);

routes.register("driverRepository", driverRepository);

httpServer.listen(3001);
