/**
 * Allowed image types for the signatures
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

export const AllowedImageExtensions = [
    'jpeg',
    'png',
    'jpg'
];

export type AllowedImageExtensionsType = typeof AllowedImageExtensions[number];