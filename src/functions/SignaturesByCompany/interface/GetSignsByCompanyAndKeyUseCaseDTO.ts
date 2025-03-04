export interface GetSignsByCompanyAndKeyUseCaseDTO {
    companyId: string | number;
    signatureKey: string;
    enableRetrieveUrl?: boolean;
}