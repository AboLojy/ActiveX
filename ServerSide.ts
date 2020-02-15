interface IAjaxObject {
    [key: string]: any
}

class ServerSide {
    public ResetConnectionObj(element: any): any {
        if (typeof (element.Conn) !== 'undefined') element.Conn = new ADOConnection(element.GetKey);
        if (typeof (element.conn) !== 'undefined') element.conn = new ADOConnection(element.GetKey);
    }
    public CallWithString(verbos: string, server: string, param: string): object {
        var xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP.4.0");
        xmlHTTP.open(verbos, server, false);
        xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var sParam = "=" + encodeURIComponent(param);
        xmlHTTP.send(sParam);

        return xmlHTTP.responseText ? JSON.parse(xmlHTTP.responseText) : null;
    }

    public CallWithObject(verbos: string, server: string, param: object): object {
        var elem = { key: "param", value: param };
        return this.Call(verbos, server, param);
    }
    beforeSend(param:object){}
    afterSend(param:object){}
    private Call(verbos: string, server: string, param: object): object {
        var xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP.4.0");
        try {
            xmlHTTP.open(verbos, server, false);
            xmlHTTP.setRequestHeader("Content-Type", "application/json");
           // Loading(true);
            this.beforeSend(param);
            xmlHTTP.send(JSON.stringify(param));
            if (xmlHTTP.readyState === 4) {
                if (xmlHTTP.status === 200) {
                    var res = xmlHTTP.responseText ? JSON.parse(xmlHTTP.responseText) : null;
                    //this.afterSend(res);
                   // Loading(false);
                    return res;
                } else {
                    console.log(JSON.parse(xmlHTTP.response));
                   // Loading(false);
                    throw xmlHTTP.statusText;
                }
            }
        } catch (e) {
           
            console.log(e);
           
        }
    }

}