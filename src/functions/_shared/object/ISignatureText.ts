import { AllowedFontFamiliesType } from "../interface/AllowedFontFamilies";

export interface ISignatureText {
    text: string;
    fontFamily: AllowedFontFamiliesType;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
}