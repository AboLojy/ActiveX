
interface IRecordSet {
    (index: string): string;
    EOF: boolean;
    Close(): void;
    MoveNext(): number;
    find(criteria: string, skipRecords: number, searchDirection: number, start: number): void;
    getRows();
    ElementAt(index: any);
    fields(fieldName: string);
    getString(
        stringFormat: number,
        numOfRows: number,
        columnDelimiter: string,
        rowDelimiter: string,
        nullExpr: string): string;
}

class RecordSet {
    
    constructor(uniqueKey: string ,data?: Array<string[]>,  sql?: string) {
        this.uniqueKey = uniqueKey;
        this.rows = data;
        //console.log("data", data);
        if (this.rows !== null && this.rows !== undefined) {
            this.rowCursor = this.rows.length > 0 ? 1 : -1;
        }
        this.sql = sql;
    }
    uniqueKey="";
    protected rows: Array<string[]> = [];
    protected rowCursor = -1;
    protected sql = "";
    protected currRSIndex = 0;
    
}

class ADORecordSet extends RecordSet {


    public constructor(uniqueKey:string,data: Array<string[]>, sql: string ) {
        super(uniqueKey,data, sql);
    }

    public Initialize(data: Array<string[]>): void {

    }

    public Find = (criteria: string, skipRecords: number, searchDirection: number, start: number) => this.find(criteria, skipRecords, searchDirection, start) ;
    public find = (criteria: string, skipRecords: number, searchDirection: number, start: number) => {
        var base = new ServerSide();
        var rsVM = new Object({  baseQuery: this.sql, criteria: criteria, skipRecords: skipRecords, searchDirection: searchDirection, start: start ,uniqueKey: this.uniqueKey});
        var res = base.CallWithObject("POST", "/TEAM/TEAM/api/socman/Core/Find", rsVM) as IAjaxObject;
        return ADOConnection.WrapADORecordSet(res.uniqueKey ,res.result,this.sql,  this.currRSIndex);

    };
    public Filter = (criteria: string) => this.filter(criteria);
    public filter = (criteria: string) => {
        var base = new ServerSide();
        var rsVM = new Object({ criteria: criteria,  uniqueKey: this.uniqueKey });
        var res = base.CallWithObject("POST", "/TEAM/TEAM/api/socman/Core/filter", rsVM) as IAjaxObject;
        this.uniqueKey = res.uniqueKey;
        this.rows = res.result;
        this.rowCursor = 1;
        this.currRSIndex = 0;

    };
     
    public Close(): void { }

    public getRows = () => {
        return this.rows;
    }

    public getRowCursor = () => {
        return this.rowCursor;
    }

    public MoveNext = () => {
        this.rowCursor = this.rowCursor + 1;
    }
    public MoveFirst = () => {
        this.rowCursor =  1;
    }

    public ElementAt = (index: any) => {
        if (typeof index == 'string') {
            return this.fields(index);
        }
        return this.rows[this.rowCursor][index];
    }

    public fields = (fieldName: string) => {
        var fieldIndex = this.rows[0].indexOf(fieldName);
        return this.rows[this.rowCursor][fieldIndex];
    }

    public SetCurrRSIndex = (currRecordSetIndex: number) => {
        this.currRSIndex = currRecordSetIndex;
    }

    public NextRecordset = () => {
        this.currRSIndex = this.currRSIndex + 1;
        var base = new ServerSide();
        var rsVM = new Object({uniqueKey:this.uniqueKey, baseQuery: this.sql, currRSIndex: this.currRSIndex});
        var res = base.CallWithObject("POST", "/TEAM/TEAM/api/socman/Core/NextRecordSet", rsVM) as IAjaxObject;
        return ADOConnection.WrapADORecordSet( res.uniqueKey,res.result, this.sql, this.currRSIndex);
    }

    CursorLocation: number = 1;
    ActiveConnection:ADOConnection = null;
    Open(sQuery: string, conn: ADOConnection, cursorType: number=-1, lockType: number=-1, options: number = 0):Function {
        var base = new ServerSide();
        var rsVM = new Object({ callerObjId: conn.objectId, sQuery: sQuery, cursorLocation: this.CursorLocation, lockType, cursorType, options });
        var res = base.CallWithObject("POST", "/TEAM/TEAM/api/socman/Core/Open", rsVM) as IAjaxObject;
        var result = ADOConnection.WrapADORecordSet(res.uniqueKey, res.result, this.sql, this.currRSIndex);

        //Object.assign(this, result);
        //this["rs"] = result.rs;
        //this["uniqueKey"] = result["rs"].uniqueKey;
        //this["Close"] = result["rs"].Close;
        //this["close"] = result["rs"].Close;
        //this["MoveNext"] = result["rs"].MoveNext;
        //this["moveNext"] = result["rs"].MoveNext;
        //this["MoveFirst"] = result["rs"].MoveFirst;
        //this["moveFirst"] = result["rs"].MoveFirst;
        //this["find"] = result["rs"].find;
        //this["Find"] = result["rs"].find;
        //this["fields"] = result["rs"].fields;
        //this["getRowCursor"] = result["rs"].getRowCursor;
        //this["getRows"] = result["rs"].getRows;
        //this["NextRecordset"] = result["rs"].NextRecordset;
        //this["NextRecordSet"] = result["rs"].NextRecordset;
        //this["nextRecordset"] = result["rs"].NextRecordset;
        //this["nextRecordSet"] = result["rs"].NextRecordset;
        //this["Open"] = result["rs"].Open;
        //this["open"] = result["rs"].Open;
        //this["CursorLocation"] = result["rs"].CursorLocation;
        //this["ActiveConnection"] = result["rs"].ActiveConnection;
        return result;
    }

    public getString = (
        stringFormat: number,
        numberOfRows: number,
        columnDelimiter: string,
        rowDelimiter: string,
        nullExpression: string): string => {

        let columnsCount: number = 0;
        let rowsInLoop: number = 0;
        let rowSeparator: string = "\n\r";
        let columnSeparator: string = "\t";
        let nullValue: string = "";
        let result: string[] = [];
        let columnValue: string = null;

        if (stringFormat == 2) {
            rowSeparator = rowDelimiter;
            columnSeparator = columnDelimiter;
            nullValue = nullExpression;
        }
        if (this.rows.length > 1) {
            rowsInLoop = this.rows.length;
            columnsCount = this.rows[0].length;

            if (stringFormat == 2 && numberOfRows > 0) {
                rowsInLoop = numberOfRows;
            }

            for (var i = 1; i < rowsInLoop; i++) {
                for (var j = 0; j < columnsCount; j++) {
                    columnValue = this.rows[i][j];
                    if (columnValue == null || columnValue == undefined) {
                        columnValue = nullValue;
                    }
                    result.push(columnValue);
                    if (columnsCount > j + 1) {
                        result.push(columnSeparator);
                    }
                }
                if (rowsInLoop > i + 1) {
                    result.push(rowSeparator);
                }
            }
        }

        return result.join("");
    }
}
