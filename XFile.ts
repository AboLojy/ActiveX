class XFile {
    protected data: string = "";

    get GetKey(): string { return `XFile${""}`; } beforeSelfOverride(): void { }
    afterSelfOverride(): void { }

    public LastError: string = "";

    public AppendData(strData: string): void {
        this.data += strData;
    }

    public appendData(strData: string): void {
        this.data += strData;
    }

    public SaveAs(strPath: string, blnRetainBuffer: boolean = false): boolean {
        return this.saveAs(strPath, blnRetainBuffer);
    }

    public saveAs(strPath: string, blnRetainBuffer: boolean = false): boolean {
        var pom = document.createElement('a');
        var fileName = "report";
        if (window.parent !== undefined && window.parent.document.title !== undefined && window.parent.document.title !== '') {
            var documentTitle = window.parent.document.title.replace('T.E.A.M. Report - ', '');
            fileName = documentTitle;
        }
        pom.setAttribute('href', tableToExcel(this.data, `${fileName}.xls`));
        pom.setAttribute('download', `${fileName}.xls`);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
        return true;
    }
}


function readFileContentAsync(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event: any) => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}


function readFileContentAsBinaryStringAsync(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event: any) => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
    });
}



