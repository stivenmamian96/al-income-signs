export interface SignatureObject {
    companyId: string | number;
    signatureKey: string;
    signatureName: string;
    base64Image: string;
    bucketKey: string;
    createdAt: string;
    retrieveUrl?: string;
    urlExpiration?: string;
}