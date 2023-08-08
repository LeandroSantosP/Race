import "dotenv/config";
import { Routes } from "./infra/api/Routes";
import { ExpressAdapter } from "./infra/api/ExpressAdapter";

const httpServer = new ExpressAdapter();
new Routes(httpServer);

httpServer.listen(3001);
