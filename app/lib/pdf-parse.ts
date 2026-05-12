import axios from "axios";
import { PDFParse } from "pdf-parse";

export async function loadPDF(fileUrl: string) {
  try {
    // Download PDF
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    // Parse PDF → text
    const parser = new PDFParse({ data: response.data });
    const data = await parser.getText();

    return data.text;
  } catch (error) {
    console.error("PDF loading error:", error);
    throw error;
  }
}