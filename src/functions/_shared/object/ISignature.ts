import { SignatureTypes } from "../interface/SignatureTypes";
import { ISignatureText } from "./ISignatureText";

export interface ISignature {
    companyId: string | number;
    signatureKey?: string;
    signatureName: string;
    type?: SignatureTypes;
    textConfig?: ISignatureText;
    imageExtension?: string;
    base64Image?: string;
    bucketKey?: string;
    retrieveUrl?: string;
    urlExpiration?: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const ISignatureToApiArray = (signature: ISignature) => {
    const fieldsToOmit = ['companyId', 'enabled'];
    return Object.fromEntries(
        Object.entries(signature)
            .filter(([key]) => !fieldsToOmit.includes(key))
    );
}