import { createCanvas, registerFont } from 'canvas';
import { SignatureTextObject } from "@functions/_shared/interface/TextSign";

export const CreateSignatureFromTextUseCase = async (params: SignatureTextObject): Promise<string> => 
{
    const signatureFontFamilyUrl = 'src/functions/SaveSignatureText/resources/fonts/' + params.signatureFontFamily + '.ttf';

    registerFont(signatureFontFamilyUrl, { family: params.signatureFontFamily });

    const width = 400;
    const height = 200;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.font = params.signatureFontSize + 'px ' + params.signatureFontFamily;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(params.signatureText, width / 2, height / 2);

    const base64Image = canvas.toDataURL('image/png');

    return base64Image;
}