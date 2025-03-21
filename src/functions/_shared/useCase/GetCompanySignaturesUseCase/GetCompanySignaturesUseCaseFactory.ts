import { GetCompanySignaturesUseCase } from "./GetCompanySignaturesUseCase";
import { GetCompanySignaturesUseCaseInterface } from "./contract/GetCompanySignaturesUseCaseInterface";

export class GetCompanySignaturesUseCaseFactory 
{
    public static getInstance(): GetCompanySignaturesUseCaseInterface 
    {
        return new GetCompanySignaturesUseCase();
    }
}