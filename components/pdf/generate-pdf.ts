// @ts-ignore
import { PdfData, htmlTemplate } from './html-template';

/**
 * Generates a PDF from the provided data
 * @param data The data to generate the PDF from
 * @param preview Whether to preview the PDF before downloading
 */
export const generatePricePdf = async (data: PdfData) => {
    try {
        const html2pdf = (await import('html2pdf.js')).default;
    
        const element = document.createElement('div');
        element.innerHTML = htmlTemplate(data);
        document.body.appendChild(element);
    
        const options = {
            margin: 0.5,
            filename: `Tilbud-${data.offerNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true,
                scrollY: -window.scrollY
            },
            jsPDF: {
                orientation: 'portrait' as const,
                unit: "mm",
                format: "a4",
            },
        };

        await html2pdf()
            .set(options)
            .from(element)
            .save();

        document.body.removeChild(element);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

