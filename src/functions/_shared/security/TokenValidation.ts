import { unauthorizedResponse } from "@libs/api-gateway";

export const TokenValidation = () => {
    return {
        before: async (handler) => {
            const token = handler.event.headers?.Authorization || '';
            if (token !== process.env.SECURITY_TOKEN) {
                return unauthorizedResponse('Unauthorized');
            }
        },
    };
};