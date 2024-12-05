/**
 * Define the schema for the saveSign request
 * adding the properties that the request must have
 * and the type of each one
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { AllowedImageExtensions } from "./AllowedImageExtensions";

export default 
{
    type: "object",
    properties: {
        idCompany: { type: ['string', 'integer'] },
        keyCountry: { type: 'string' },
        image: { type: 'string' },
        signatureKey: { type: 'string' },
        imageType: {
            type: 'string',
            enum: AllowedImageExtensions
        }
    },
    required: ['idCompany', 'keyCountry', 'image', 'imageType', 'signatureKey'],
} as const;