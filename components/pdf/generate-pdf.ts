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
    
        // Extract customer name from info (first line)
        const customerName = data.info.split('\n')[0].trim();
        const safeFileName = customerName.replace(/[^a-zA-Z0-9æøåÆØÅ\s-]/g, '_');
        const fileName = `Tilbud-${data.offerNumber}-${safeFileName}.pdf`;
    
        const options = {
            margin: 0.5,
            filename: fileName,
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
            pagebreak: {
                mode: ['css'],
                before: ['.page-break'],
                after: ['.page-break'],
                avoid: ['img', '.header-logo', '.page-number']
            }
        };

        const pdf = await html2pdf()
            .set(options)
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdf: any) => {
                const totalPages = pdf.internal.getNumberOfPages();
                // Only add page numbers if there's actual content
                if (totalPages > 0) {
                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.setFontSize(8);
                        pdf.text(`Side ${i} av ${totalPages}`, pdf.internal.pageSize.getWidth() - 30, 10);
                    }
                }
                return pdf;
            });

        await pdf.save(fileName);
        document.body.removeChild(element);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

