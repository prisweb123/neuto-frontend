'use client';

import { htmlTemplate, PdfData } from "@/components/pdf/html-template";
import { useEffect, useState } from "react";
import "./preview.css";

const sampleData: PdfData = {
  offerNumber: 12345,
  date: "2024-03-19",
  validUntil: "2024-04-19",
  createdBy: "John Doe",
  terms: "Standard terms and conditions apply",
  VatValue: 2500,
  totalWithoutVAT: 10000,
  total: 12500,
  campaignDiscount: 500,
  additionalDiscount: 1000,
  info: "Customer Name\nAddress Line 1\nCity, Country",
  package: {
    _id: "1",
    name: "Premium Package",
    description: "Complete solution for your needs",
    price: 8000,
    discount: 1000,
    include: "Feature 1\nFeature 2\nFeature 3",
    endDate: "2024-05-01",
    image: "",
    markeModels: [],
    info: ""
  },
  optionPackages: [
    {
      _id: "1",
      name: "Add-on Package 1",
      markeModels: [],
      info: "",
      options: [
        {
          id: "1",
          name: "Option 1",
          price: "2000",
          isSelected: true,
          isActive: true,
          discountPrice: "500",
          discountEndDate: "2024-04-01"
        }
      ]
    }
  ],
  manualProducts: [
    {
      name: "Custom Product",
      description: "Tailored solution",
      price: 1500,
      discount: 200,
      vat: 25,
      totalPrice: 1700
    }
  ]
};

export default function PreviewPage() {
  const [previewData, setPreviewData] = useState<PdfData>(sampleData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PREVIEW_DATA') {
        setPreviewData(event.data.data);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // If no data received within 2 seconds, show sample data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);

  const handleDownload = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const options = {
      margin: 0.5,
      filename: `Tilbud-${previewData.offerNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      },
    }

    const doc = html2pdf().from(htmlTemplate(previewData)).set(options).toPdf();
    await doc.save();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 bg-gray-100 border-b preview-header sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">PDF Preview</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review your document before downloading
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Download PDF
          </button>
        </div>
      </div>
      <div 
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: htmlTemplate(previewData) }}
      />
    </div>
  );
} 