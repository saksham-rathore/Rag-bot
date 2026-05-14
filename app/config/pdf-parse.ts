import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';

export async function extractText(filepath: string) {
    const buffer = readFileSync(filepath);
    const pdf = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await pdf.getText();

    return result.text;
}