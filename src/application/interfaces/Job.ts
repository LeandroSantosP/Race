export interface Job {
    name: string;
    handle(data: any): Promise<any>;
}
