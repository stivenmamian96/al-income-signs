import { ISignatureText } from "@functions/_shared/object/ISignatureText";
import { CreateImageFromTextUseCaseInterface } from "./contract/CreateImageFromTextUseCaseInterface";
import { createCanvas, registerFont } from "canvas";

export class CreateImageFromTextCanvasUseCase implements CreateImageFromTextUseCaseInterface
{
    async execute(params: ISignatureText): Promise<string> 
    {
        if (params.text.length > 30) {
            throw new Error('Text must be less than 30 characters');
        }

        let fontString = '';
        let fontSize = 95;
        const height = 100;
        const maxWidth = 350;
        const signatureFontFamilyUrl = 'src/functions/_shared/resources/fonts/' + params.fontFamily + '.ttf';
        registerFont(signatureFontFamilyUrl, { family: params.fontFamily });
        if (params.isBold) { }
        if (params.isItalic) { }
        fontString += fontSize + 'px ' + params.fontFamily;

        // Create a temporary canvas to measure text width
        const tempCanvas = createCanvas(0, 0);
        const tempContext = tempCanvas.getContext('2d');


        // Ajustar el tamaño de la fuente para que el texto quepa en el ancho máximo
        do {
            fontString = fontSize + 'px ' + params.fontFamily;
            tempContext.font = fontString;
            const textWidth = tempContext.measureText(params.text).width;
            if (textWidth <= maxWidth) {
                break;
            }
            fontSize -= 1; // Reducir el tamaño de la fuente
        } while (fontSize > 0);

        tempContext.font = fontString;
        const textWidth = tempContext.measureText(params.text).width;

        // Create image
        const width = textWidth + 10;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'black';
        context.font = fontString;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(params.text, width / 2, height / 2);   
        const base64Image = canvas.toDataURL('image/png');
    
        return base64Image;
    }
}