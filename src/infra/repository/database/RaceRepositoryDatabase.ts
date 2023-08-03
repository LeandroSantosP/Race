import { IRaceRepository } from "@/application/repository/IRaceRepository";
import { knex_connection } from "@/database/knex";
import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";
import { Race } from "@/domain/entity/Race/Race";
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
        const { driver_id, passenger_id } = await this.getPassengerAndDriverIds(race);

        await this.connection("race").insert({
            id: race.id,
            sequence: race.sequence,
            raceDate: race.raceDate,
            status: race.status,
            ticket: race.getTicket(),
            raceFinished: race.raceFinished,
            driver_id,
            passenger_id,
            price: race.getPrice(),
        });
    }

    async get(id: string): Promise<Race> {
        const [raceData] = await this.connection("race").where({ id });

        if (!raceData) throw new Error("Race not found");

        const race = Race.recreate(raceData.sequence, parseFloat(raceData.price), raceData.id, raceData.raceDate);
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
            const [driverData] = await this.connection("driver").where({ id: raceData.driver_id });
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

        return race;
    }

    async getSequence(): Promise<number> {
        const countResult: Array<{ count: number }> = await this.connection("race").count();
        return countResult[0].count + 1;
    }
    private async getPassengerAndDriverIds(race: Race) {
        let passenger_id: null | string = null;
        let driver_id: null | string = null;

        const [driverData, passengerData] = await this.getDriverAndPassenger(
            race.getPassenger()?.cpf,
            race.getDriver()?.cpf
        );
        passenger_id = passengerData?.id ?? null;
        driver_id = driverData?.id ?? null;

        return {
            passenger_id,
            driver_id,
        };
    }

    async update(race: Race): Promise<void> {
        const { driver_id, passenger_id } = await this.getPassengerAndDriverIds(race);
        await this.connection("race").update({
            driver_id,
            passenger_id,
            status: race.status,
            raceFinished: race.raceFinished,
            price: race.getPrice(),
            ticket: race.getTicket(),
        });
    }

    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
