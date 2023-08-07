import { randomUUID } from "crypto";

export abstract class Entity<T> {
    protected props: T;
    private _id: string;
    constructor(props: T, id?: string) {
        this.props = props;
        this._id = id ?? randomUUID();
    }

    getParams(): T {
        return this.props;
    }
}
