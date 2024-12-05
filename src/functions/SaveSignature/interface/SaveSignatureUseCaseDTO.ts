/**
 * Define the schema for the saveSignUse case parameters
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { AllowedImageExtensionsType } from "../config/AllowedImageExtensions";

export interface SaveSignatureUseCaseDTO 
{
    keyCountry: string;
    idCompany: string | number;
    base64Image: string;
    contentType: AllowedImageExtensionsType;
    signatureKey: string;
}