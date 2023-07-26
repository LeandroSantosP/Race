import { IRoutesRepository } from "@/application/repository/IRoutesRepository";
import { Route } from "@/domain/entity/Race/Route";

export class RoutesRepositoryMemory implements IRoutesRepository {
    routes: Route[] = [];

    async save(route: Route): Promise<void> {
        this.routes.push(route);
    }
}
