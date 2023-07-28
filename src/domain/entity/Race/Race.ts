import { randomUUID } from "crypto";
import { Route } from "./Route";
import { Ticket } from "@/domain/VO/Ticket";
import { Passenger } from "../Passenger";
import { Driver } from "../Driver";

export class Race {
    ticket: Ticket;
    status: string;
    private passenger: Passenger | null = null;
    private driver: Driver | null = null;
    public raceFinished: boolean = false;
    private race_price: null | number = null;

    private constructor(readonly id: string, readonly sequence: number, readonly raceDate: Date) {
        this.status = "waiting";
        this.ticket = new Ticket(raceDate, sequence);
    }

    static create(sequence: number, id: string = randomUUID(), raceDate: Date = new Date()): Race {
        return new Race(id, sequence, raceDate);
    }

    static recreate(sequence: number, price: number, id: string = randomUUID(), raceDate: Date = new Date()): Race {
        const race = new Race(id, sequence, raceDate);

        race.setPrice(price);
        return race;
    }

    getTicket(): string {
        return this.ticket.getTicket();
    }

    setStatus(status: string) {
        if (status === "approved") {
            this.status = "approved";
        } else {
            this.status = "rejected";
        }
    }

    getPrice(): number {
        if (!this.race_price && this.race_price !== 0) throw new Error("Price not found");
        return this.race_price;
    }

    matchPassenger(matchPassenger: Passenger) {
        this.passenger = matchPassenger;
    }

    matchDriver(matchDriverInput: Driver) {
        this.driver = matchDriverInput;
    }

    setPrice(price: number) {
        this.race_price = price;
    }

    getPassenger() {
        if (!this.passenger) return null;
        return {
            cpf: this.passenger.cpf.getValeu(),
            status: this.status,
            email: this.passenger.email.value,
        };
    }

    getDriver() {
        if (!this.driver) return null;
        return {
            cpf: this.driver.cpf.getValeu(),
            status: this.status,
        };
    }

    fishedRace(date: Date) {
        this.raceFinished = true;
        const diffInMilliseconds = date.getTime() - this.raceDate.getTime();
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
        return diffInHours;
    }
}
