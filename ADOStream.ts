class ADOStream {
    stream: string;
    Open(): void { }
    Close(): void {}
    ReadText(): string {
        return this.stream;
    }
}