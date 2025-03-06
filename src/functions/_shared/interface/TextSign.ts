import { AllowedFontFamiliesType } from "./AllowedFontFamilies";

export interface SignatureTextObject {
    signatureFontSize: number;
    signatureFontFamily: AllowedFontFamiliesType;
    signatureText: string;
}