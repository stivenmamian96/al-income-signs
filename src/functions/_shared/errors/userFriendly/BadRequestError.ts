import { _UserFriendlyError } from "./_UserFriendlyError";

export class BadRequestError extends _UserFriendlyError {
    constructor(message) {
        super(message, 400);
    }
}