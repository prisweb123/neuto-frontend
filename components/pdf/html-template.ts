import { ManualProduct, OptionProduct, Product } from "../pricing/type";
import { formatDate } from "@/lib/utils";

export interface PdfData {
  discount: string;
  offerNumber: number;
  date: string;
  validUntil: string;
  createdBy: string;
  terms?: string;
  VatValue: number;
  totalWithoutVAT: number;
  total: number;
  campaignDiscount: number;
  additionalDiscount: number;
  package: Product | null;
  optionPackages: OptionProduct[];
  manualProducts: ManualProduct[];
  info: string;
}

const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

export const htmlTemplate = (data: PdfData) => {
  // Helper function to safely handle undefined or null values
  const safeString = (value: any): string => value || '';
  console.log(data)
  
  // Helper function to safely handle package data
  const renderPackageSection = () => {
    if (!data.package) return '';
    
    // Handle include property whether it's a string or array
    const includeText = Array.isArray(data.package.include) 
      ? data.package.include[0] || ''
      : data.package.include || '';
    
    const includeItems = includeText
      .split("\n")
      .map((line: string) => line.replace(/^[•\s]+/, "").trim())
      .filter((line: string) => line.length > 0)
      .map((val: string) => `<div style="display: flex; margin: 4px 0;">
        <span style="min-width: 15px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px; letter-spacing: 0; color: #363C45;">•</span>
        <span style="padding-left: 5px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px; letter-spacing: 0; color: #363C45;">${val}</span>
      </div>`)
      .join("");

    return `<div style="border-bottom: 1px solid #eee; padding: 15px 10px;">
      <div style="display: flex; justify-content: space-between; padding: 3px">
        <div style="width: 50%; text-align: left;">
          <p style="margin: 0; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px; letter-spacing: 0; color: #363C45;">
            ${safeString(data.package.name)} ${
              data.package.endDate
                ? `<span style="color: #FF0000; font-style: italic; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px;">(KAMPANJE ${formatDate(
                    data.package.endDate
                  )})</span>`
                : ""
            }
          </p>
          <p style="margin: 4px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-style: italic; font-size: 14px; line-height: 150%; letter-spacing: 0; color: #1C1C1C;">
            ${safeString(data.package.description)}
          </p>
          <div style="margin: 8px 0 0 0; padding: 0;">
            ${includeItems}
          </div>
        </div>
        <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px; letter-spacing: 0; color: #363C45;">
          ${formatPrice(data.package.discount || 0)},-
        </div>
        <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px; letter-spacing: 0; color: #363C45;">
          25 %
        </div>
        <div style="width: 20%; text-align: right;">
          <div style="display: flex; flex-direction: column; align-items: flex-end;">
            ${data.package.discount ? `
              <div style="position: relative; margin-bottom: 2px;">
                <span style="position: relative; display: inline-block; color: #808080; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px;">
                  ${formatPrice(data.package.price)},-
                  <span style="position: absolute; left: 0; right: 0; top: 75%; height: 1.5px; background-color: #808080; transform: translateY(-50%);"></span>
                </span>
              </div>
              <div>
                <span style="color: #FF0000; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; line-height: 28px;">
                  ${formatPrice(data.package.price - data.package.discount)},-
                </span>
              </div>
            ` : `
              <div>
                <span style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px;">
                  ${formatPrice(data.package.price)},-
                </span>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>`;
  };

  return `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0 30px 30px; color: #333; max-width: 900px; margin: 0 auto; font-size: 10px; line-height: 1.2;">
    <style>
      @font-face {
        font-family: 'Josefin Sans';
        src: url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400&display=swap');
      }
    </style>
    <header style="display: flex; justify-content: space-between; margin-bottom: 50px; page-break-inside: avoid;">
      <div style="width: 50%;">
        <div style="width: 180px; margin-bottom: 15px;">
          <img src="pdf logo.jpg" alt="Merhebia Logo" style="width: 100%; height: auto;">
        </div>
        <div>
          ${data.info
            .split("\n")
            .filter((line) => line.length > 0)
            .map((val) => `<p style="margin: 1px 0;">${val}</p>`)
            .join("")}
        </div>
      </div>
      
      <div style="width: 339px; height: 301px; text-align: left; background-color: #F8F8F8; padding: 20px; padding-left: 30px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 13px; margin-bottom: 15px; font-family: 'Inter', sans-serif;">Merhebia Finest AS</p>
        <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">Vintergata 19</p>
        <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">3048 Drammen</p>
        <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">NORGE</p>
        <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">post@merhebia.no</p>
        <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">+47 90085591</p>
        
        <div style="margin-top: 30px;">
          <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">Organisasjons nr</p>
          <p style="margin: 2px 0; font-family: 'Inter', sans-serif;">929 922 013 MVA</p>
        </div>
        <div style="margin-top:50px; width: 85%; display: flex;">
          <div style="width: 60%;">
            <p style="margin: 2px 0; text-align: left; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400; text-transform: uppercase;">TILBUD</p>
            <p style="margin: 2px 0; text-align: left; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400; text-transform: uppercase;">DATO</p>
            <p style="margin: 2px 0; text-align: left; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400; text-transform: uppercase;">GJELDER TIL</p>
            <p style="margin: 2px 0; text-align: left; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400; text-transform: uppercase;">TILBUD OPPRETTET AV</p>
          </div>
          <div style="width: 40%;">
            <p style="margin: 2px 0; text-align: right; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400;">${data.offerNumber}</p>
            <p style="margin: 2px 0; text-align: right; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400;">${data.date}</p>
            <p style="margin: 2px 0; color: #e63946; text-align: right; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400;">${data.validUntil}</p>
            <p style="margin: 2px 0; text-align: right; font-family: 'Josefin Sans', sans-serif; font-size: 8px; font-weight: 400;">${data.createdBy}</p>
          </div>
        </div>
      </div>
    </header>
    
    <div style="margin-top: -70px;">
      <h1 style="font-family: 'Poppins', sans-serif; font-size: 30px; font-weight: 400; line-height: normal; letter-spacing: 0px; margin-bottom: 30px;">Tilbud</h1>
    </div>
    
    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; padding: 20px 20px 12px 20px; background-color: rgba(241, 241, 241, 0.4); border-bottom: 1px solid #ddd;">
        <div style="width: 50%; text-align: left; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 24px; letter-spacing: 0px; color: #363C45;">Beskrivelse</div>
        <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 24px; letter-spacing: 0px; color: #363C45;">Rabatt</div>
        <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 24px; letter-spacing: 0px; color: #363C45;">MVA</div>
        <div style="width: 20%; text-align: right; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 24px; letter-spacing: 0px; color: #363C45;">Beløp</div>
      </div>
      
      ${renderPackageSection()}
      
      ${data.optionPackages
        .map((_optionPackage) => {
          const options = _optionPackage.options
            .filter((_option) => _option.isSelected)
            .map((val) => `<div style="display: flex;">
              <span style="min-width: 15px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px; letter-spacing: 0; color: #363C45;">•</span>
              <span style="padding-left: 5px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px; letter-spacing: 0; color: #363C45;">${val.name} 
                ${val.discountPrice ? `
                  <span style="position: relative; display: inline-block; color: #808080; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px; margin-right: 4px;">
                    ${formatPrice(Number(val.price))},-
                    <span style="position: absolute; left: 0; right: 0; top: 75%; height: 1.5px; background-color: #808080; transform: translateY(-50%);"></span>
                  </span>
                  <span style="color: #FF0000; font-weight: 600;">
                    ${formatPrice(Number(val.price) - Number(val.discountPrice))},-
                    ${val.discountEndDate ? `<span style="font-style: italic;">(Kampanje ${formatDate(val.discountEndDate)})</span>` : ''}
                  </span>
                ` : `
                  <span style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px;">
                    ${formatPrice(Number(val.price))},-
                  </span>
                `}
              </span>
            </div>`)
            .join("");

          return `<div style="border-bottom: 1px solid #eee; padding: 15px 10px; page-break-inside: avoid; page-break-before: auto; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <div style="width: 50%; text-align: left;">
                <p style="margin: 0; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; line-height: 28px; letter-spacing: 0; color: #363C45;">${_optionPackage.name}</p>
                <div style="margin: 8px 0 0 0; padding: 0;">
                  ${options}
                </div>
              </div>
              <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px; letter-spacing: 0; color: #363C45;"></div>
              <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px; letter-spacing: 0; color: #363C45;">25 %</div>
              <div style="width: 20%; text-align: right; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 28px; letter-spacing: 0; color: #363C45;">
                ${formatPrice(
                  _optionPackage.options
                    .filter((_option) => _option.isSelected)
                    .reduce(
                      (total, item) =>
                        total +
                        (item.discountPrice
                          ? Number(item.price) - Number(item.discountPrice)
                          : Number(item.price) || 0),
                      0
                    )
                )},-
              </div>
            </div>
          </div>`;
        })
        .join("")}
      
      ${data.manualProducts
        .map(
          (_product) => `<div style="padding: 15px 10px; page-break-inside: avoid; page-break-before: auto; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <div style="width: 50%; text-align: left;">
                <p style="margin: 0; font-weight: bold; font-size: 16px; font-family: 'Inter', sans-serif;">${_product.name}</p>
                <p style="margin: 4px 0; font-style: italic; color: #333; font-size: 11px; font-family: 'Inter', sans-serif;">${_product.description}</p>
              </div>
              <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif;">${formatPrice(_product.discount || 0)},-</div>
              <div style="width: 15%; text-align: right; font-family: 'Inter', sans-serif;">${_product.vat} %</div>
              <div style="width: 20%; text-align: right; font-family: 'Inter', sans-serif;">
                <p style="margin: 0; color: #777;">${formatPrice(_product.totalPrice)},-</p>
              </div>
            </div>
            <div style="border-top: 1px solid #ddd; margin-top: 10px;"></div>
          </div>`
        )
        .join("")}
    </div>
    
    <div style="display: flex; margin-top: 70px; margin-left: 20px; margin-right: 20px; font-size: 14px; page-break-inside: avoid; page-break-before: auto; padding-top: 30px;">
      <div style="width: 60%; padding-right: 20px;">
        ${data.terms ? `
        <div style="background-color: #FBFCFE; padding: 20px; border-radius: 16px; border: 1px solid #EFF2F5;">
          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400; line-height: 24px; letter-spacing: 0px; color: #363C45 !important;">${safeString(data.terms)}</p>
        </div>
        ` : ''}
      </div>
      
      <div style="width: 40%; background-color: #FBFCFE; padding: 20px; border-radius: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <div style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400; line-height: 24px; letter-spacing: 0px; color: #737982;">Rabatt ${data.discount}%</div>
          <div style="font-family: 'Inter'; font-size: 14px; font-weight: 500; line-height: 24px; letter-spacing: 0px; color: #363C45; text-align: right;">${formatPrice(data.additionalDiscount)},-</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <div style="font-family: 'Inter'; font-size: 14px; font-weight: 400; line-height: 24px; letter-spacing: 0px; color: #737982;">Kampanje rabatt</div>
          <div style="font-family: 'Inter'; font-size: 14px; font-weight: 500; line-height: 24px; letter-spacing: 0px; color: #363C45; text-align: right;">${formatPrice(data.campaignDiscount)},-</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <div style="font-family: 'Inter'; font-size: 14px; font-weight: 400; line-height: 24px; letter-spacing: 0px; color: #737982;">Mva 25 %</div>
          <div style="font-family: 'Inter'; font-size: 14px; font-weight: 500; line-height: 24px; letter-spacing: 0px; color: #363C45; text-align: right;">${formatPrice(data.VatValue)},-</div>
        </div>
        <div style="border-top: 1px solid #363C45; border-bottom: 1px solid #363C45; margin: 16px 0;"></div>
        <div style="display: flex; justify-content: space-between;">
          <div style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 24px; letter-spacing: 0px; color: #363C45;">Å Betale</div>
          <div style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 24px; letter-spacing: 0px; color: #363C45; text-align: right;">${formatPrice(data.total)},-</div>
        </div>
                <div style="border-top: 1px solid #363C45; border-bottom: 1px solid #363C45; margin: 16px 0;"></div>

      </div>
    </div>
  </div>`;
};