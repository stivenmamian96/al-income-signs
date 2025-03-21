import { ISignatureText } from "@functions/_shared/object/ISignatureText";
import { CreateImageFromTextUseCaseInterface } from "./contract/CreateImageFromTextUseCaseInterface";
import { createCanvas, registerFont } from "canvas";

export class CreateImageFromTextCanvasUseCase implements CreateImageFromTextUseCaseInterface
{
    async execute(params: ISignatureText): Promise<string> 
    {
        const signatureFontFamilyUrl = 'src/functions/SaveSignature/resources/fonts/' + params.fontFamily + '.ttf';

        registerFont(signatureFontFamilyUrl, { family: params.fontFamily });
    
        const width = 350;
        const height = 100;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
    
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'black';
        const fontSize = 95;

        let fontString = '';
        if (params.isBold) {
            // fontString += 'bold ';
        }
        if (params.isItalic) {
            // fontString += 'italic ';
        }
        fontString += fontSize + 'px ' + params.fontFamily;
        context.font = fontString;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(params.text, width / 2, height / 2);   
        const base64Image = canvas.toDataURL('image/png');
    
        return base64Image;
    }
}