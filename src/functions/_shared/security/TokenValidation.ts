import { unauthorizedResponse } from "@libs/api-gateway";

export const TokenValidation = () => {
    return {
        before: async (handler) => {
        },
    };
};