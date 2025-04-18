declare module 'html2pdf.js' {
    export interface Html2PdfOptions {
        margin?: number;
        filename?: string;
        image?: {
            type?: string;
            quality?: number;
        };
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            logging?: boolean;
            scrollY?: number;
        };
        jsPDF?: {
            orientation?: 'portrait' | 'landscape';
            unit?: string;
            format?: string;
        };
    }

    export interface Html2PdfInstance {
        set(options: Html2PdfOptions): Html2PdfInstance;
        from(element: string | HTMLElement): Html2PdfInstance;
        save(): Promise<void>;
        toPdf(): {
            save: () => Promise<void>;
        };
    }

    export interface Html2PdfStatic {
        (): Html2PdfInstance;
    }

    const html2pdf: Html2PdfStatic;
    export default html2pdf;
} 