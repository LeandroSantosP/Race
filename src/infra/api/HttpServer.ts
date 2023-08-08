export interface HttpServer {
    on(method: "post" | "get" | "use", url: string, callback: Function, handlers?: any): Promise<void>;
    listen(port: number): void;
}
