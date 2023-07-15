import { IHandler } from "@/application/handler/Handle";
import { IDomainEvent } from "../../domain/event/DomainEvent";

export interface IMediator {
    publisher(domainEvent: IDomainEvent): Promise<void>;
    register(handle: IHandler): void;
}
