
/// <reference path="./ServerSide.ts" />

// ReSharper disable  InconsistentNaming
class ADOConnection {
    public objectId :string =  "";
    public defaultDatabase:string="";
   

    constructor(objectId?:string,dbName?:string) {
        if (objectId)
            this.objectId = objectId;
        if (dbName)
            this.defaultDatabase = dbName;
    }
    execute(sql: string): any {
        return this.Execute(sql);
    }


    Execute(sql: string): any {
        var base = new ServerSide();   
                    
        var result = base.CallWithObject("POST", "/TEAM/TEAM/api/socman/Core/Execute", new Object({ sSql: sql, callerObjId: this.objectId}) ) as IAjaxObject;
        return ADOConnection.WrapADORecordSet( result.uniqueKey,result.result, sql);
    }

    static WrapADORecordSet(uniqueKey:string, result: any, sql: string,currRecordSetIndex?: number): any {
        var rs = new ADORecordSet(uniqueKey,result, sql);

        if (currRecordSetIndex !== undefined && currRecordSetIndex !== null) {
            rs.SetCurrRSIndex(currRecordSetIndex);
        }

        function IADORecordSet(index: number): string {

            return rs.ElementAt(index);
        }

        IADORecordSet["rs"] = rs;
        IADORecordSet["uniqueKey"] = IADORecordSet["rs"].uniqueKey;
        IADORecordSet["Close"] = IADORecordSet["rs"].Close;
        IADORecordSet["close"] = IADORecordSet["rs"].Close;
        IADORecordSet["MoveNext"] = IADORecordSet["rs"].MoveNext;
        IADORecordSet["moveNext"] = IADORecordSet["rs"].MoveNext;
        IADORecordSet["MoveFirst"] = IADORecordSet["rs"].MoveFirst;
        IADORecordSet["moveFirst"] = IADORecordSet["rs"].MoveFirst;
        IADORecordSet["find"] = IADORecordSet["rs"].find;
        IADORecordSet["Find"] = IADORecordSet["rs"].find;
        IADORecordSet["fields"] = IADORecordSet["rs"].fields;
        IADORecordSet["getRowCursor"] = IADORecordSet["rs"].getRowCursor;
        IADORecordSet["getRows"] = IADORecordSet["rs"].getRows;
        IADORecordSet["NextRecordset"] = IADORecordSet["rs"].NextRecordset;
        IADORecordSet["NextRecordSet"] = IADORecordSet["rs"].NextRecordset;
        IADORecordSet["nextRecordset"] = IADORecordSet["rs"].NextRecordset;
        IADORecordSet["nextRecordSet"] = IADORecordSet["rs"].NextRecordset;
        IADORecordSet["Open"] = IADORecordSet["rs"].Open;
        IADORecordSet["open"] = IADORecordSet["rs"].Open;
        IADORecordSet["CursorLocation"] = IADORecordSet["rs"].CursorLocation;
        IADORecordSet["ActiveConnection"] = IADORecordSet["rs"].ActiveConnection;
        IADORecordSet["getString"] = IADORecordSet["rs"].getString;
        IADORecordSet["GetString"] = IADORecordSet["rs"].getString;

        Object.defineProperty(IADORecordSet, "filter", {
            set(value) {
                rs.filter(value);
            }
        });
        Object.defineProperty(IADORecordSet, "Filter", {
            set(value) {
               rs.filter(value);
            }
        });

        Object.defineProperty(IADORecordSet, "EOF", {
            get: function () {
                var eof = true;
                //TODO: to be removed after implementing "GetCompanyCustomFieldSchema"
                if (this.getRows == undefined) {
                    return false;
                }
                var rows = this.getRows();
                var rowCursor = this.getRowCursor();
                if (rows !== null && rows !== undefined) {
                    eof = rowCursor >= rows.length || rows.length === 0;
                }
                return eof || rowCursor === -1;
            },
            //writable: true,
            enumerable: false
        });

        return IADORecordSet;
    }
}