// this is mainly for logging in the future

export class Err {
    public error: any | null = null;
    public custom: string | null = null;
    readonly time: Date = new Date();

    // name of command
    public name: string | null = null;

    // id of user who used the command
    public userId: number | null = null;

    public output: string | null = null;
    public checkErr: () => Err;

    public constructor(
        error: any | null,
        custom: string | null,
        name: string | null,
        userId: number | null,
    ) {
        this.error = error;
        this.custom = custom;
        this.name = name;
        this.userId = userId;

        this.checkErr = function(): Err {
            if (this.custom && this.custom.length > 0) {
                this.output = this.custom;
            }
            else if (error.message && error.message.length > 0) {
                this.output = this.error.message;
            }
            else {
                this.output = 'An unknown error has occurred.';
            }

            console.error(`Time: [${this.time.toUTCString()}]\nCommand: ${this.name}\nUser: ${this.userId}\nError: ${this.error.message}\nCustom: ${this.custom}\nOutput: ${this.output}`);

            return this;
        };
    }
}
