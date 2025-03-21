import { ISignatureText } from "../object/ISignatureText";
import { SignatureTypes } from "./SignatureTypes";
export interface SignatureObject {
    companyId: string | number;
    signatureKey: string;
    signatureName: string;
    base64Image: string;
    bucketKey: string;
    type: SignatureTypes;
    textConfig?: ISignatureText;
    createdAt: string;
    retrieveUrl?: string;
    urlExpiration?: string;
}