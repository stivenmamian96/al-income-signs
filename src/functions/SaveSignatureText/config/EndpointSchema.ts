/**
 * Define the schema for the saveSign request
 * adding the properties that the request must have
 * and the type of each one
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { AllowedFontFamilies } from "@shared/interface/AllowedFontFamilies";

export default 
{
    type: "object",
    properties: {
        idCompany: { type: ['string', 'integer'] },
        signatureName: { type: 'string' },
        content: { type: 'string' },
        fontSize: { type: 'integer' },
        fontFamily: { type: 'string', enum: AllowedFontFamilies },
        isBold: { type: 'boolean' },
        isItalic: { type: 'boolean' },
        isUnderlined: { type: 'boolean' },
    },
    required: ['idCompany', 'signatureName', 'content', 'fontSize', 'fontFamily'],
} as const;