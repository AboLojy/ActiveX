
class FileSystemObject {
    private content: string = "";

    public GetSpecialFolder: any = (fileName: any) => ({
        path: ""
    })

    public CreateTextFile: any = (outFile: any, arg1: boolean, arg2: boolean) => {
        var self = this;
        return {
            WriteLine(inputText: any) {
                self.content += inputText + "\n";
            },
            Write(inputText: any) {
                self.content += inputText;
            },
            Close() {
            },
            GetContent() { return self.content; }
        };
    }

    public GetTempName: any = () => ""
}
