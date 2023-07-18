import { IDomainEvent } from "./DomainEvent";

export class DriverAcceptEvent implements IDomainEvent {
    name = "DriverAccept";

    constructor(readonly passengerEmail: string, readonly driverName: string, readonly carPlate: string) {}
}
