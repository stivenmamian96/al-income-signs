import { CreateImageFromTextUseCaseInterface } from "./contract/CreateImageFromTextUseCaseInterface";
import { CreateImageFromTextCanvasUseCase } from "./CreateImageFromTextCanvasUseCase";

export class CreateImageFromTextUseCaseFactory
{
    static getInstance(): CreateImageFromTextUseCaseInterface
    {
        return new CreateImageFromTextCanvasUseCase();
    }
}