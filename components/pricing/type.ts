/**
 * Date string in DD/MM/YY format
 */
export type DateString = string;

export interface OptionItem {
    id: string
    name: string
    price: string
    discountPrice?: string
    isActive: boolean
    /** Date in DD/MM/YY format */
    discountEndDate?: DateString
    isSelected: boolean
  }
  
  export interface MarkeModelPair {
    marke: string
    model: string
  }

  export interface OptionProduct {
    _id: string
    name: string
    markeModels: MarkeModelPair[]
    info: string
    options: OptionItem[]
  }
  
  export interface Product {
    _id: string
    name: string
    description: string
    image: string
    markeModels: MarkeModelPair[]
    price: number
    discount?: number
    /** Date in DD/MM/YY format */
    endDate?: DateString
    include: string
    info: string
  }

  export interface ManualProduct {
    name: string
    price: number
    description: string
    discount: number
    vat: number
    totalPrice: number
  }

  export interface Offer {
    "_id": string,
    offerNo: number,
    "selectedPackage": Product | null,
    "marke": string,
    "model": string,
    "info": string,
    "addedOptionPackages": OptionProduct[],
    "manualProducts": ManualProduct[],
    "discount": string,
    "terms": string,
    /** Number of days the offer is valid for */
    "validDays": string,
    "createdBy": {
      "_id": string,
      "email": string,
      "username": string
    },
  }