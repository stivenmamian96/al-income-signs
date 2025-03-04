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
        idCompany: { type: ['string', 'integer'] },
        signatureName: { type: 'string' },
        image: { type: 'string' }
    },
    required: ['idCompany', 'signatureName', 'image'],
} as const;