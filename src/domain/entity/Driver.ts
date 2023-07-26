import { randomUUID } from "crypto";
import { Age } from "../VO/Age";

import { User } from "./User";
import { Cpf } from "../VO/Cpf";
import { Plate } from "../VO/Plate";

export class Driver extends User {
    private constructor(id: string, driverName: string, age: Age, cpf: Cpf, readonly plate_car: Plate) {
        super(id, driverName, age, cpf);
    }
    static create(driverName: string, age: number, cpf: string, plate_car: string, id: string = randomUUID()) {
        return new Driver(id, driverName, new Age(age), new Cpf(cpf), new Plate(plate_car));
    }

    static recreate(driverName: string, age: number, cpf: string, plate_car: string, id: string = randomUUID()) {
        return new Driver(id, driverName, new Age(age), new Cpf(cpf), new Plate(plate_car));
    }
}
