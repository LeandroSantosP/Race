import { randomUUID } from "crypto";
import { Age } from "../VO/Age";

import { User } from "./User";
import { Cpf } from "../VO/Cpf";
import { Password } from "../VO/Password";

export class Email {
    value: string;
    constructor(email: string) {
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) throw new Error("Invalid email");
        this.value = email;
    }
}

export class Passenger extends User {
    email: Email;
    password: Password;

    private constructor(id: string, passengerName: string, email: Email, password: Password, age: Age, cpf: Cpf) {
        super(id, passengerName, age, cpf);
        this.email = email;
        this.password = password;
    }
    getParams() {
        throw new Error("Method not implemented.");
    }

    static async create(
        passengerName: string,
        email: string,
        password: string,
        age: number,
        cpf: string,
        id: string = randomUUID()
    ) {
        return new Passenger(
            id,
            passengerName,
            new Email(email),
            await Password.create(password),
            new Age(age),
            new Cpf(cpf)
        );
    }

    static recreate(
        id: string,
        passengerName: string,
        email: string,
        password: string,
        salt: number,
        age: number,
        cpf: string
    ) {
        return new Passenger(
            id,
            passengerName,
            new Email(email),
            Password.recreate(password, salt),
            new Age(age),
            new Cpf(cpf)
        );
    }
}
