export class RequestAction {
    constructor(doStr) {
        this.verb = 'return';
        this.arguments = [];
        if (!doStr)
            throw new Error("Value was null or undefined.");
        let segs = doStr.split(' ');
        if (segs[0].length > 0)
            this.verb = segs[1];
        if (segs.length > 1)
            this.arguments = segs.slice(1);
    }
    getVerb() {
        return this.verb;
    }
    getArguments() {
        return this.arguments;
    }
}
//# sourceMappingURL=RequestAction.js.map