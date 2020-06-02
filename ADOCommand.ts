/// <reference path="ADOConnection.ts" />
/// <reference path="ADOStream.ts" />
class ADOCommand {
    ActiveConnection:ADOConnection;
    CommandTimeout:number = 0;
    CommandText: string;
    OutputStream: ADOStream;

    //Properties(propName: string): any {
    //    switch (propName) {
    //        case "Output Stream": return this.OutputStream;
    //        default: return this[propName];
    //    }
    //}
    Execute(obj1: any, obj2: any, adExecuteStream:any): void {
        var base = new ServerSide();

        
        var result = base.CallWithObject("POST", "/Core/ExecuteCommand",
            new Object({ sSql:this.CommandText, callerObjId: this.ActiveConnection.objectId, adExecuteStream: adExecuteStream })) as IAjaxObject;
        this.OutputStream.stream = result.result;

    }
}
