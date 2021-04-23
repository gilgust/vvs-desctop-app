export default class QueryModel implements IQueryModel{
    action: string;
    public data?: any;

    constructor(action: string) {
        this.action = action;
    }
}
export interface IQueryModel {
    action : string;
    data?: any;
}