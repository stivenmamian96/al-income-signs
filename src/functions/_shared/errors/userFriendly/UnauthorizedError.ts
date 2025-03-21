import { _UserFriendlyError } from "./_UserFriendlyError";

export class UnauthorizedError extends _UserFriendlyError {
    constructor(message: string) {
        super(message, 401);
    }
}