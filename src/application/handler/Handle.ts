import { IDomainEvent } from "@/domain/event/DomainEvent";

export interface IHandler {
    eventName: string;
    handle(event: IDomainEvent): Promise<void>;
}
