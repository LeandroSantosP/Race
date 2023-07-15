import { randomUUID } from "crypto";
import { Route } from "./Route";
import { Ticket } from "@/domain/VO/Ticket";
import { Passenger } from "../Passenger";
import { Driver } from "../Driver";

export class Race {
    routes: Route[];
    ticket: Ticket;
    status: string;
    private passenger: Passenger | null = null;
    private driver: Driver | null = null;

    private constructor(readonly id: string, readonly sequence: number, readonly raceDate: Date) {
        this.routes = [];
        this.status = "waiting";
        this.ticket = new Ticket(raceDate, sequence);
    }

    static create(sequence: number, id: string = randomUUID(), raceDate: Date = new Date()): Race {
        return new Race(id, sequence, raceDate);
    }

    addRoutes(route: Route) {
        this.routes.push(route);
    }

    getPrice() {
        const price = this.routes.reduce((acc, route) => {
            return (acc += route.calculate());
        }, 0);

        if (price <= 15) {
            return 15;
        }

        return price;
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

    matchPassenger(matchPassenger: Passenger) {
        this.passenger = matchPassenger;
    }

    matchDriver(matchDriverInput: Driver) {
        this.driver = matchDriverInput;
    }

    getPassenger() {
        if (!this.passenger) return null;
        return {
            cpf: this.passenger.cpf.getValeu(),
            status: this.status,
        };
    }

    getDriver() {
        if (!this.driver) return null;
        return {
            cpf: this.driver.cpf.getValeu(),
            status: this.status,
        };
    }
}
