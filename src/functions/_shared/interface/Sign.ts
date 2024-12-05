export interface SignatureObject {
    companyId: string | number;
    keyCountry: string;
    signatureKey: string;
    bucketKey: string;
    createdAt: string;
    retrieveUrl?: string;
    urlExpiration?: string;
}