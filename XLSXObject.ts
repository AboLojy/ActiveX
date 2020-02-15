class XLSXObject {
    public Visible: boolean;
    protected rows: any[];
    protected sheets: any[];
    protected workbook: any;
    protected sheet: any;

    public constructor() {
        var self = this;

        this.WorkBooks["Open"] = (fileName: any) => {
        }

        this.WorkBooks["OpenText"] = async function (file: any, fileType?: any) {
            var fileContent: any;
            if (file.GetContent !== undefined) {
                fileContent = file.GetContent();
                let link = document.createElement('a');
                let fileName = "";
                if (fileType !== undefined && fileType == 'xml') {
                    fileName = "report.xls";
                } else {
                    fileName = "report.csv";
                    fileContent = fileContent.replace(/\t/g, ",");
                }
                let blob = new Blob([fileContent], { type: "octet/stream" });
                let blobUrl = URL.createObjectURL(blob);
                link.setAttribute('href', blobUrl);
                link.setAttribute("download", fileName);
                if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    link.dispatchEvent(event);
                }
                else {
                    link.click();
                }
            }
            else {
                fileContent = await readFileContentAsBinaryStringAsync(file).catch((err) => { debugger; alert(err); });
                if (fileContent !== undefined) {
                    //var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
                    self.workbook = XLSX.read(fileContent, { type: 'binary' });
                    self.workbook.WorkSheets = (num: number) => {
                        var sheetName = self.workbook.SheetNames[num - 1];
                        return self.workbook.Sheets[sheetName];
                    }
                    if (self.workbook !== undefined && self.workbook.SheetNames.length > 0) {
                        for (var i = 0; i < self.workbook.SheetNames.length; i++) {
                            var sheetName = self.workbook.SheetNames[i];
                            self.attachRowsToSheet(self.workbook.Sheets[sheetName]);
                        }
                    }
                }

            }
        }
    }

    private attachRowsToSheet(sheet: any) {
        var self = this;
        sheet.sheetRows = XLSX.utils.sheet_to_row_object_array(
            sheet,
            { header: 1 /* Generate an array of arrays ("2D Array")*/ });
        sheet.rows = function (rowNumber: number) {
            var slefSheet = this;
            var row = slefSheet.sheetRows[rowNumber - 1];
            row.Columns = function (columnNumber: number) {
                var slefRow = this;
                var column = slefRow[columnNumber - 1];
                return column;
            }
            return row;
        }
        sheet.rows.Count = sheet.sheetRows.length;
    }

    public WorkBooks(num: number): any {
        return this.workbook;
    }

    public Application: any = {
        Quit() {
        }
    }
}
