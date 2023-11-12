export class MessagePattern {
    private cmd: string;

    constructor(cmd: string) {
        this.cmd = cmd;
    }

    static from(cmd: string) {
        return new MessagePattern(cmd);
    }
}
