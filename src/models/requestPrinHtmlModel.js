class RequestPrintHtmlModel{
    action;
    data;
    printDataType;

    constructor(action, data, printDataType) {
        this.action = action;
        this.data = data;
        this.printDataType = printDataType;
    }
}

module.exports.getRequestPrintHtmlModel = () => RequestPrintHtmlModel