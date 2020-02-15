/// <reference path="FileSystemObject.ts" />
/// <reference path="XFile.ts" />
/// <reference path="XLSXObject.ts" />
/// <reference path="XMLObject.ts" />
/// <reference path="ADOCommand.ts" />


class ActiveX {
    constructor(objectName) {
        switch (objectName) {
            case "MSXML2.XMLHTTP.4.0":
            case "MSXML2.XMLHTTP.6.0":
                return new XMLHttpRequest();
            case "customClass": // your user defined class if you got one
                return new myCoreServerSide();

            case "MSXML2.DOMDocument.4.0":
            case "MSXML2.DOMDocument.6.0":
                return new XMLObject();

            case "Excel.Application": {
                return new XLSXObject();
            }
            case "Scripting.FileSystemObject": {
                return new FileSystemObject();
            }
            case "Socman.XFile": {
                return new XFile();
            }
            case "WScript.Shell": {
                return new WScriptShell();
            }
            case "Word.Application": {
                return new WordApplication();
            }
            case "ADODB.Command": return new ADOCommand();
            case "ADODB.Stream": return new ADOStream();
            case "ADODB.Recordset":
            case "ADODB.RecordSet":
                return ADOConnection.WrapADORecordSet(null, null, null);
               
            default: break;
        }
        return {};
    }
}
declare var XLSX: any;

class myCoreServerSide{
    login():object{
        // server ajax call 
        return new Object();
    }
}

class WScriptShell {

    public RegRead(key: string): string {
        return "";
    }
}

class WordApplication {

    public Visible: boolean;
    public ActiveDocument: any = {
        MailMerge: {
            OpenDataSource(outFile: any, arg1: number) {

            }
        }
    };
}

declare function unescape(s: string): string;

var tableToExcel = (tableHtml: string, fileName: string) => {
    
    var uri = 'data:application/vnd.ms-excel.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;base64,';

    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExycelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>{table}</body></html>';
    var base64 = s => window.btoa(unescape(encodeURIComponent(s)));
    var format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);
    var ctx = { worksheet: fileName || 'Worksheet', table: tableHtml }
    return uri + base64(format(template, ctx));

}


if (window.ActiveXObject) {
    window.ActiveXObject = null;
    delete window.ActiveXObject;
} else {
    window.ActiveXObject = ActiveX;
}
window["guid"] = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};