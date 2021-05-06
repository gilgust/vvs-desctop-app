class WebSocketActions{
    /**
     * @return {string}
     */
    static PrintHtml = 'printHtml';
        /**
     * @return {string}
     */
    static Printed = 'printed';
    /**
     * @return {string}
     */
    static Scan = 'scan';
    /**
     * @return {string}
     */
    static Scaned = 'scaned';
    /**
     * @return {string}
     */
    static CheckConnection = 'checkConnection';
    /**
     * @return {string}
     */
    ConnectionChecked = 'connectionChecked';
    /**
     * @return {string}
     */
    static Connected = 'connected';
}

module.exports = WebSocketActions;