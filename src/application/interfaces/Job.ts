export interface Job {
    queue: any;
    name: string;
    handle(data: any): Promise<any>;
}
