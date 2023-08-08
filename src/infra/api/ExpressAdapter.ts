import { Application, NextFunction, Request, Response } from "express";
import { HttpServer } from "./HttpServer";
import express from "express";

export class ExpressAdapter implements HttpServer {
    app: Application;
    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    async on(method: "post" | "get" | "use", url: string, callback: Function, handlers?: any): Promise<any> {
        this.app[method](
            url,
            async (req: Request, res: Response, next: NextFunction) => {
                const output = await callback(req.params, req.body, next);
                res.json(output);
            },
            handlers === undefined ? [] : handlers
        );
    }
    listen(port: number): void {
        this.app.listen(port, () => console.log(`Server running on port ${port}`));
    }
}
