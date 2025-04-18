import { ManualProduct, OptionProduct, Product } from "./type"

export const getValidUntilDate = (validDays: string) => {
  if (!validDays || isNaN(Number(validDays))) {
    return new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("nb-NO")
  }

  const date = new Date()
  date.setDate(date.getDate() + Number(validDays))
  return date.toLocaleDateString("nb-NO")
}


export const calculateTotals = (packages: Product[], selectedPackage: string, addedOptionPackages: OptionProduct[], manualProducts: ManualProduct[], discount: string) => {
  let total = 0
  let campaignDiscount = 0

  // Calculate package price
  const selectedPkg = packages.find(pkg => pkg._id === selectedPackage)
  if (selectedPkg) {
    total += selectedPkg.discount ? selectedPkg.price - selectedPkg.discount : selectedPkg.price
    if (selectedPkg.discount) {
      campaignDiscount += selectedPkg.discount
    }
  }

  // Calculate option packages price
  addedOptionPackages.forEach(optPkg => {
    optPkg.options.forEach(opt => {
      if (opt.isSelected) {
        total += opt.discountPrice ? Number(opt.price) - Number(opt.discountPrice) : Number(opt.price)
        if (opt.discountPrice) {
          campaignDiscount += Number(opt.discountPrice)
        }
      }
    })
  })

  //Apply VAT 25%
  let VATValue = total * 0.25
  let totalWithoutVAT = total - VATValue;

  // Add manual products
  manualProducts.forEach((product) => {
    total += product.totalPrice;
    VATValue += (product.vat / 100) * (product.price - product.discount)
    totalWithoutVAT += (product.price - product.discount)
  })



  // Apply additional discount
  const additionalDiscount = discount ? (total * Number(discount)) / 100 : 0
  total -= additionalDiscount

  const additionalWithoutVATDiscount = discount ? (totalWithoutVAT * Number(discount)) / 100 : 0
  totalWithoutVAT -= additionalWithoutVATDiscount

  const additionalVATDiscount = discount ? (VATValue * Number(discount)) / 100 : 0
  VATValue -= additionalVATDiscount

  const totalDiscount = additionalDiscount

  return {
    total: Math.round(total),
    VATValue: Math.round(VATValue),
    totalWithoutVAT: Math.round(totalWithoutVAT),
    campaignDiscount: Math.round(campaignDiscount),
    additionalDiscount: Math.round(totalDiscount)
  }
}