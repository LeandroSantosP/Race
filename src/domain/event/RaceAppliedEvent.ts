import { IDomainEvent } from "./DomainEvent";

export class RaceAppliedEvent implements IDomainEvent {
    name = "RaceApplied";

    constructor(
        readonly raceId: string,
        readonly creditCardToken: string,
        readonly passengerEmail: string,
        readonly passengerName: string
    ) {}
}
