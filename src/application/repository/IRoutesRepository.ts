import { Route } from "@/domain/entity/Race/Route";

export interface IRoutesRepository {
    save(route: Route): Promise<void>;
}
