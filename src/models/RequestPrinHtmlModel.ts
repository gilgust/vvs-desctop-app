export default class RequestPrinHtmlModel{
    action: string;
    public data: string;

    constructor(action: string, data: string) {
        this.action = action;
        this.data = data;
    }
}