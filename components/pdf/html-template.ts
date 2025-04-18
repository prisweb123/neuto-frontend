import { ManualProduct, OptionProduct, Product } from "../pricing/type";
import { formatDate } from "@/lib/utils";

export interface PdfData {
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

export const htmlTemplate = (data: PdfData) =>
  `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0 30px 30px; color: #333; max-width: 900px; margin: 0 auto; font-size: 10px; line-height: 1.2;"> 
    <header style="display: flex; justify-content: space-between; margin-bottom: 50px; page-break-inside: avoid;">
        <div style="width: 50%; ">
            <div style="width: 180px; margin-bottom: 15px;">
                <img src="pdf logo.jpg" alt="Merhebia Logo" style="width: 100%; height: auto;">
            </div>
            
            <div style="">
                ${data.info
                  .split("\n")
                  .filter((line) => line.length > 0)
                  .map((val) => `<p style="margin: 1px 0;">${val}</p>`)
                  .join("")}
            </div>
        </div>
        
        <div style="width: 40%; text-align: left; background-color: #f5f5f5; padding: 20px; padding-left: 30px;">
            <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 13px; margin-bottom: 15px;">Merhebia Finest AS</p>
            <p style="margin: 2px 0;">Vintergata 19</p>
            <p style="margin: 2px 0;">3048 Drammen</p>
            <p style="margin: 2px 0;">NORGE</p>
            <p style="margin: 2px 0;">post@merhebia.no</p>
            <p style="margin: 2px 0;">+47 90085591</p>
            
            <div style="margin-top: 30px;">
                <p style="margin: 2px 0;">Organisasjons nr</p>
                <p style="margin: 2px 0;">929 922 013 MVA</p>
            </div>
            <div style="width: 50%;"></div>
            <div style="margin-top:50px; width: 65%; display: flex;">
                <div style="width: 60%;">
                    <p style="margin: 2px 0;  text-align: left;">TILBUD</p>
                    <p style="margin: 2px 0;  text-align: left;">DATO</p>
                    <p style="margin: 2px 0;  bold; text-align: left;">GJELDER TIL</p>
                    <p style="margin: 2px 0;  text-align: left;">TILBUD OPPRETTET AV</p>
                </div>
                <div style="width: 40%;">
                    <p style="margin: 2px 0; text-align: right;">${
                      data.offerNumber
                    }</p>
                    <p style="margin: 2px 0; text-align: right;">${
                      data.date
                    }</p>
                    <p style="margin: 2px 0; color: #e63946; text-align: right;">${
                      data.validUntil
                    }</p>
                    <p style="margin: 2px 0; text-align: right;">${
                      data.createdBy
                    }</p>
                </div>
            </div>
        </div>
    </header>
    
    <div style="margin-top: -70px;">
        <h1 style="font-size: 20px; margin-bottom: 30px; font-weight: normal;">Tilbud</h1>
    </div>
    
    <div style="margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: rgba(0, 0, 0, 0.1);">
            <div style="width: 50%; text-align: left;">Beskrivelse</div>
            <div style="width: 15%; text-align: right;">Rabatt</div>
            <div style="width: 15%; text-align: right;">MVA</div>
            <div style="width: 20%; text-align: right;">Beløp</div>
        </div>
        
        ${
          data.package
            ? `<div style="border-bottom: 1px solid #eee; padding: 15px 10px;">
        <div style="border-bottom: 1px solid #eee; display: flex; justify-content: space-between; padding: 3px">
            <div style="width: 50%; text-align: left;">
                <p style="margin: 0; font-weight: bold; font-size: 14px;">
                    ${data.package.name} ${
                data.package.endDate
                  ? `<span style="color: #e63946; font-style: italic;">(KAMPANJE ${formatDate(
                      data.package.endDate
                    )})</span>`
                  : ""
              }
                </p>
                <p style="margin: 4px 0; font-style: italic; color: #333; font-size: 11px;">${
                  data.package.description
                }</p>
                    <div style="margin: 8px 0 0 0; padding: 0;">
                        ${data.package.include[0]
                          .split("\n")
                          .map((line) => line.replace(/^[•\s]+/, "").trim())
                          .filter((line) => line.length > 0)
                          .map((val) => {
                            return `<div style="display: flex; margin: 4px 0; font-size: 11px;">
                                    <span style="min-width: 15px; text-align: center;">•</span>
                                    <span style="padding-left: 5px;">${val}</span>
                                </div>`;
                          })
                          .join("")}
                    </div>
                </div>
                <div style="width: 15%; text-align: right;">${formatPrice(
                  data.package.discount || 0
                )},-</div>
                <div style="width: 15%; text-align: right;">25 %</div>
                <div style="width: 20%; text-align: right;">
                <div style="position: relative; display: inline-block; margin-bottom: 5px;">
                    <p style="margin: 0; color: #777; position: relative; display: inline-block;">
                        <span>${formatPrice(data.package.price)},-</span>
                        <span style="position: absolute; left: 0; top: 100%; width: 100%; border-top: 1px solid #777; transform: translateY(-20%);"></span>
                    </p>
                    <p style="margin: 0; color: #e63946; font-weight: bold;">${formatPrice(
                      data.package.discount
                        ? data.package.price - data.package.discount
                        : data.package.price
                    )},-</p>
                </div>
            </div>
        </div>`
            : ""
        }
        
       ${data.optionPackages
         .map((_optionPackage) => {
           return ` <div style="border-bottom: 1px solid #eee; padding: 15px 10px; page-break-inside: avoid; page-break-before: auto; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between;">
                    <div style="width: 50%; text-align: left;">
                        <p style="margin: 0; font-weight: bold; font-size: 14px;">${
                          _optionPackage.name
                        }</p>
                        <div style="margin: 8px 0 0 0; padding: 0;">
                        ${_optionPackage.options
                          .filter((_option) => _option.isSelected)
                          .map((val) => {
                            return `<div style="display: flex; margin: 4px 0; font-size: 11px;">
                                <span style="min-width: 15px; text-align: center;">•</span>
                                <span style="padding-left: 5px;">${
                                  val.name
                                } ${formatPrice(Number(val.price))},-${
                              val.discountPrice
                                ? `/ <span style="color: #e63946; font-weight: bold; ">${formatPrice(
                                    Number(val.price) -
                                      Number(val.discountPrice)
                                  )},-${
                                    val.discountEndDate
                                      ? `(Kampanje ${val.discountEndDate})`
                                      : ``
                                  }</span>`
                                : ""
                            }</span>
                            </div>`;
                          })
                          .join("")}
                        </div>
                    </div>
                    <div style="width: 15%; text-align: right;"></div>
                    <div style="width: 15%; text-align: right;">25 %</div>
                    <div style="width: 20%; text-align: right;">${formatPrice(
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
                    )},-</div>
                </div>
                </div>
            `;
         })
         .join("")}

        ${data.manualProducts
          .map(
            (
              _product
            ) => `<div style="padding: 15px 10px; page-break-inside: avoid; page-break-before: auto; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between;">
                <div style="width: 50%; text-align: left;">
                    <p style="margin: 0; font-weight: bold; font-size: 16px;">${
                      _product.name
                    }</p>
                    <p style="margin: 4px 0; font-style: italic; color: #333; font-size: 11px;">${
                      _product.description
                    }</p>
                </div>
                <div style="width: 15%; text-align: right;">${formatPrice(
                  _product.discount || 0
                )},-</div>
                <div style="width: 15%; text-align: right;">${
                  _product.vat
                } %</div>
                <div style="width: 20%; text-align: right;">
                    <p style="margin: 0; color: #777;">${formatPrice(
                      _product.price
                    )},-</p>
                </div>
            </div>
            <div style="border-top: 1px solid #ddd; margin-top: 10px;"></div>
        </div>`
          )
          .join("")}
    </div>
    
    <div style="display: flex; margin-top: 70px; margin-left: 20px; margin-right: 20px; font-size: 14px; page-break-inside: avoid; page-break-before: auto; padding-top: 30px;">
        <div style="width: 60%; padding-right: 20px;">
            <div style="background-color: #FBFCFE; padding: 10px; border-radius: 4px; border-style: solid;">
                <p style="margin: 5px;">${data.terms}</p>
            </div>
        </div>
        
        <div style="width: 40%;">
            <div style="display: flex; justify-content: space-between; margin: 10px;">
                <div style="font-weight:lighter;">Rabatt</div>
                <div style="font-weight:500;">${formatPrice(
                  data.additionalDiscount
                )},-</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px;">
                <div style="font-weight:lighter;">Mva 25 %</div>
                <div style="font-weight:500;">${formatPrice(
                  data.VatValue
                )},-</div>
            </div>
            <div style="border-top: 1px solid #ddd; margin: 10px 0;"></div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 14px; font-weight: bold;">
                <div>Å Betale</div>
                <div>${formatPrice(data.total)},-</div>
            </div>
            <div style="border-top: 1px solid #ddd; margin: 10px 0;"></div>

        </div>
    </div>
</div>`;
