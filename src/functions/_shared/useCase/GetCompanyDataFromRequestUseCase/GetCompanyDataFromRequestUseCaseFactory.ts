import { GetCompanyDataFromRequestUseCaseInterface } from "./contract/GetCompanyDataFromRequestUseCaseInterface";
import { GetCompanyDataFromTokenUseCase } from "./GetCompanyDataFromTokenUseCase";

export class GetCompanyDataFromRequestUseCaseFactory 
{
    static getInstance(): GetCompanyDataFromRequestUseCaseInterface 
    {
        return new GetCompanyDataFromTokenUseCase();
    }
}