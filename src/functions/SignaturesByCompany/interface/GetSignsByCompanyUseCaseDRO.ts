import { SignatureObject } from "@functions/_shared/interface/Sign";

export interface GetSignsByCompanyUseCaseDRO {
    count: number;
    signatures: SignatureObject[];
}