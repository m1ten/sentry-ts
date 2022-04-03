export class Err {
    public error: any | null = null;
    public custom: string | null = null;
    public time: Date = new Date();

    public name: string | null = null; // name of command
    public userId: number | null = null; // id of user who used the command

    public output: string | null = null;
    public check_err: () => Err;

    public constructor(error: any | null, custom: string | null, name: string | null, userId: number | null) {
        this.error = error;
        this.custom = custom;
        this.name = name;
        this.userId = userId;

        this.check_err = function (): Err {
            console.error(`[${this.time.toUTCString()}]\nCommand: ${this.name}\nUser: ${this.userId}\nError: ${this.error.message}\nCustom: ${this.custom}`);

            if (error.custom) {
                this.output = error.custom;

                return this;
            }

            switch (this.error.message) {
                case "Missing Permissions":
                    this.output = `Missing permission to use \`${name}\`.`;
                    break;
                case "Invalid Command":
                    this.output = `Invalid command: \`${name}\`.`;
                    break;
            }

            return this;
        }
    }
}

