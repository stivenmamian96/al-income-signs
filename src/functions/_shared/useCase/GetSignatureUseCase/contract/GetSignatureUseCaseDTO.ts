export interface GetSignatureUseCaseDTO {
    companyId: string;
    signatureKey: string;
    enableRetrieveUrl: boolean;
    throwErrorIfNotFound: boolean;
    includeDeleted: boolean;
}