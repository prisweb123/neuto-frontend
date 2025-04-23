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

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) {
    return '0';
  }
  return price.toLocaleString();
};
// 🔥 True final fix: Flexbox column, margin-top auto to push footer, no height
export const htmlTemplate = (data: PdfData) => {
  const safeString = (value: any): string => value || '';

  const renderPackageSection = () => {
    if (!data.package) return '';
    const includeText = Array.isArray(data.package.include)
      ? data.package.include[0] || ''
      : data.package.include || '';
    const includeItems = includeText
      .split("\n")
      .map((line: string) => line.replace(/^[•\s]+/, "").trim())
      .filter((line: string) => line.length > 0)
      .map((val: string) => `<div style="display: flex; margin: 4px 0;">
        <span style="min-width: 15px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; line-height: 28px; color: #363C45;">•</span>
        <span style="padding-left: 5px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; line-height: 28px; color: #363C45;">${val}</span>
      </div>`) 
      .join("");
    return `<div style="border-bottom: 1px solid #eee; padding: 15px 10px;">
      <div style="display: flex; justify-content: space-between; padding: 3px">
        <div style="width: 50%; text-align: left;">
          <p style="margin: 0; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; line-height: 28px; color: #363C45;">
            ${safeString(data.package.name)} ${
              data.package.endDate ? `<span style="color: #FF0000; font-style: italic; font-size: 14px;">(KAMPANJE ${formatDate(data.package.endDate)})</span>` : ""
            }
          </p>
          <p style="margin: 4px 0; font-style: italic; font-size: 12px; color: #1C1C1C;">${safeString(data.package.description)}</p>
          <div style="margin-top: 8px;">${includeItems}</div>
        </div>
        <div style="width: 15%; text-align: right; font-size: 12px; color: #363C45;">${formatPrice(data.package.discount)},-</div>
        <div style="width: 15%; text-align: right; font-size: 12px; color: #363C45;">25 %</div>
        <div style="width: 20%; text-align: right;">
          <div style="display: flex; flex-direction: column; align-items: flex-end;">
            ${data.package.discount ? `
              <div><span style="text-decoration: line-through; color: #808080;">${formatPrice(data.package.price)},-</span></div>
              <div><span style="color: #FF0000; font-weight: 600;">${formatPrice((data.package.price || 0) - (data.package.discount || 0))},-</span></div>
            ` : `<div><span>${formatPrice(data.package.price)},-</span></div>`}
          </div>
        </div>
      </div>
    </div>`;
  };

  return `
    <div style="font-family: Arial, sans-serif; font-size: 10px; color: #333; line-height: 1.2; max-width: 900px; margin: auto; padding: 0 30px; display: flex; flex-direction: column; box-sizing: border-box; min-height: 100vh;">
      <div>
        <header style="display: flex; justify-content: space-between; margin-bottom: 50px; page-break-inside: avoid;">
          <div style="width: 50%;">
            <div style="width: 180px; margin-bottom: 15px;">
              <img src="pdf logo.jpg" alt="Merhebia Logo" style="width: 100%; height: auto;">
            </div>
            <div>
              ${data.info.split("\n").filter(l => l.length).map(val => `<p style="margin: 1px 0;">${val}</p>`).join('')}
            </div>
          </div>
          <div style="width: 339px; height: 301px; text-align: left; background-color: #F8F8F8; padding: 20px 30px;">
            <p style="margin: 0 0 15px 0; font-weight: bold; font-size: 13px; font-family: 'Inter', sans-serif;">Merhebia Finest AS</p>
            <p style="margin: 2px 0;">Vintergata 19</p>
            <p style="margin: 2px 0;">3048 Drammen</p>
            <p style="margin: 2px 0;">NORGE</p>
            <p style="margin: 2px 0;">post@merhebia.no</p>
            <p style="margin: 2px 0;">+47 90085591</p>
            <div style="margin-top: 30px;">
              <p style="margin: 2px 0;">Organisasjons nr</p>
              <p style="margin: 2px 0;">929 922 013 MVA</p>
            </div>
            <div style="margin-top:50px; display: flex;">
              <div style="width: 60%;">
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-transform: uppercase;">TILBUD</p>
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-transform: uppercase;">DATO</p>
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-transform: uppercase;">GJELDER TIL</p>
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-transform: uppercase;">TILBUD OPPRETTET AV</p>
              </div>
              <div style="width: 40%;">
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-align: right;">${data.offerNumber}</p>
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-align: right;">${data.date}</p>
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-align: right; color: #e63946;">${data.validUntil}</p>
                <p style="margin: 2px 0; font-size: 8px; font-weight: 400; text-align: right;">${data.createdBy}</p>
              </div>
            </div>
          </div>
        </header>

        <h1 style="margin-top: -70px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 400; margin-bottom: 30px;">Tilbud</h1>

        <div style="margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; padding: 20px; background-color: rgba(241, 241, 241, 0.4); border-bottom: 1px solid #ddd;">
            <div style="width: 50%; font-weight: 600;">Beskrivelse</div>
            <div style="width: 15%; text-align: right; font-weight: 600;">Rabatt</div>
            <div style="width: 15%; text-align: right; font-weight: 600;">MVA</div>
            <div style="width: 20%; text-align: right; font-weight: 600;">Beløp</div>
          </div>
          ${renderPackageSection()}
        </div>
      </div>

      <div style="margin-top: auto;">
        <div style="display: flex; font-size: 14px;">
          <div style="width: 60%; padding-right: 20px;">
            ${data.terms ? `<div style="background-color: #FBFCFE; padding: 20px; border-radius: 16px; border: 1px solid #EFF2F5;">
              <p style="margin: 0; font-size: 14px; color: #363C45;">${safeString(data.terms)}</p>
            </div>` : ''}
          </div>
          <div style="width: 40%; background-color: #FBFCFE; padding: 20px; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
              <div style="color: #737982;">Rabatt ${data.discount}%</div>
              <div style="text-align: right;">${formatPrice(data.additionalDiscount)},-</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
              <div style="color: #737982;">Kampanje rabatt</div>
              <div style="text-align: right;">${formatPrice(data.campaignDiscount)},-</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
              <div style="color: #737982;">Mva 25 %</div>
              <div style="text-align: right;">${formatPrice(data.VatValue)},-</div>
            </div>
            <div style="border-top: 1px solid #363C45; border-bottom: 1px solid #363C45; margin: 16px 0;"></div>
            <div style="display: flex; justify-content: space-between;">
              <div style="font-weight: 600; color: #363C45;">Å Betale</div>
              <div style="font-weight: 600; color: #363C45; text-align: right;">${formatPrice(data.total)},-</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};