import { _UserFriendlyError } from "./_UserFriendlyError";

export class NotFoundError extends _UserFriendlyError {
    constructor(message) {
        super(message, 404);
    }
}