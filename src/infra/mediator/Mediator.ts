import { IDomainEvent } from "@/domain/event/DomainEvent";
import { IMediator } from "./IMediator";
import { IHandler } from "@/application/handler/Handle";

export class Mediator implements IMediator {
    handlers: IHandler[] = [];
    async publisher(domainEvent: IDomainEvent): Promise<void> {
        for (const handler of this.handlers) {
            if (handler.eventName === domainEvent.name) {
                await handler.handle(domainEvent);
            }
        }
    }
    register(handle: IHandler): void {
        this.handlers.push(handle);
    }
}
