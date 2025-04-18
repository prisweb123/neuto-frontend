export interface OptionItem {
    id: string
    name: string
    price: string
    discountPrice?: string
    isActive: boolean
    discountEndDate?: string
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
    endDate?: string
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
    "validDays": string,
    "createdBy": {
      "_id": string,
      "email": string,
      "username": string
    },
  }