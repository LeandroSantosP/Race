import { IRaceRepository } from "@/application/repository/IRaceRepository";
import { knex_connection } from "@/database/knex";
import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";
import { Race } from "@/domain/entity/Race/Race";
import { Route } from "@/domain/entity/Race/Route";
import { randomUUID } from "crypto";
import { Knex } from "knex";

export class RaceRepositoryDatabase implements IRaceRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }
    private async getDriverAndPassenger(
        passenger_cpf?: string,
        driver_cpf?: string
    ): Promise<[Driver | null, Passenger | null]> {
        let passenger: Passenger | null = null;
        let driver: Driver | null = null;

        if (driver_cpf) {
            const [driverData] = await this.connection("driver").where({ cpf: driver_cpf });
            if (driverData) {
                driver = Driver.recreate(
                    driverData.driver_name,
                    driverData.age,
                    driverData.cpf,
                    driverData.plate_car,
                    driverData.id
                );
            }
        }

        if (passenger_cpf) {
            const [passengerData] = await this.connection("passenger").where({ cpf: passenger_cpf });
            if (passengerData) {
                passenger = Passenger.recreate(
                    passengerData.id,
                    passengerData.passenger_name,
                    passengerData.email,
                    passengerData.password,
                    passengerData.salt,
                    passengerData.age,
                    passengerData.cpf
                );
            }
        }

        return [driver, passenger];
    }

    async save(race: Race): Promise<void> {
        let passenger_id: null | string = null;
        let driver_id: null | string = null;

        const [driverData, passengerData] = await this.getDriverAndPassenger(
            race.getPassenger()?.cpf,
            race.getDriver()?.cpf
        );
        passenger_id = passengerData?.id ?? null;
        driver_id = driverData?.id ?? null;
        await this.connection("race").insert({
            id: race.id,
            sequence: race.sequence,
            raceDate: race.raceDate,
            status: race.status,
            ticket: race.getTicket(),
            raceFinished: race.raceFinished,
            driver_id,
            passenger_id,
        });

        await Promise.all(
            race.routes.map(async (route) => {
                await this.connection("route").insert({
                    id: randomUUID(),
                    distance: route.distance,
                    created_at: route.date,
                    race_id: race.id,
                });
            })
        );
    }

    async get(id: string): Promise<Race> {
        const [raceData] = await this.connection("race").where({ id });
        if (!raceData) throw new Error("Race not found");
        const race = Race.recreate(raceData.sequence, raceData.id, raceData.raceDate);
        if (raceData.passenger_id) {
            const [passengerData] = await this.connection("passenger").where({ id: raceData.passenger_id });
            if (!passengerData) throw new Error("Passenger not found");
            race.matchPassenger(
                Passenger.recreate(
                    passengerData.id,
                    passengerData.passenger_name,
                    passengerData.email,
                    passengerData.password,
                    passengerData.salt,
                    passengerData.age,
                    passengerData.cpf
                )
            );
        }

        if (raceData.driver_id) {
            const [driverData] = await this.connection("driver").where({ id: raceData.passenger_id });
            if (!driverData) throw new Error("Driver not found");
            race.matchDriver(
                Driver.recreate(
                    driverData.driver_name,
                    driverData.age,
                    driverData.cpf,
                    driverData.plate_car,
                    driverData.id
                )
            );
        }
        race.setStatus(raceData.status);
        race.raceFinished = raceData.raceFinished;
        const race_routes = await this.connection("route").where({ id: raceData.route_id });

        for (const route of race_routes) {
            race.addRoutes(new Route(route.distance, route.create_at));
        }

        return race;
    }

    async getSequence(): Promise<number> {
        const countResult: Array<{ count: number }> = await this.connection("race").count();
        return countResult[0].count;
    }

    async update(race: Race): Promise<void> {
        await this.connection("race")
            .update({
                sequence: race.sequence,
                raceDate: race.raceDate,
            })
            .where({ id: race.id });
    }

    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
