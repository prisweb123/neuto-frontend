// @ts-ignore
import { PdfData, htmlTemplate } from './html-template';

export const generatePricePdf = async (data: PdfData) => {
    try {
        const html2pdf = (await import('html2pdf.js')).default;

    
        const options = {
            margin: 0.5,
            filename: `Tilbud-${data.offerNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: {
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            },
        }

        const doc = html2pdf().from(htmlTemplate(data)).set(options).toPdf();

        await doc.save();
    } catch (error) {
        console.log('Error in generating pdf')
    }
}

