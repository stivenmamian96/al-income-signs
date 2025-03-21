export abstract class _UserFriendlyError extends Error 
{
    public message: string;
    public httpCode: number;

    constructor(message: string, httpCode: number) {
        super(message);
        this.message = message;
        this.httpCode = httpCode;
    }
}