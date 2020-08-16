export class RequestAction {
    private verb: string;
    private arguments: string[];

    constructor(doStr: string) {
        this.verb = 'return';
        this.arguments = [];
        if (!doStr) throw new Error("Value was null or undefined.");
        
        let segs : string[] = doStr.split(' ');
        if (segs[0].length > 0) this.verb = segs[1];
        if (segs.length > 1) this.arguments = segs.slice(1);
    }

    public getVerb() : string {
        return this.verb;
    }

    public getArguments() : string[] {
        return this.arguments;
    }
}
