/**
 * Define the schema for the saveSign request
 * adding the properties that the request must have
 * and the type of each one
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

export default 
{
    type: "object",
    properties: {
        signatureKey: { type: 'string' },
        signatureName: { type: 'string' },
        image: { type: 'string' },
        textConfig: { 
            type: 'object',
            properties: {
                text: { type: 'string' },
                fontFamily: { type: 'string' },
                isBold: { type: 'boolean' },
                isItalic: { type: 'boolean' },
                isUnderlined: { type: 'boolean' },
            }
        }
    },
    required: ['signatureKey'],
} as const;