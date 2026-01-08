export interface ProductSummary {
  id: string;
  brand: string;
  model: string;
  price?: string;
  imgUrl: string;
}

export interface ProductOptionItem {
  code: number;
  name: string;
}

export interface ProductDetail extends ProductSummary {
  cpu?: string;
  ram?: string;
  os?: string;
  displayType?: string;
  displayResolution?: string;
  battery?: string;
  primaryCamera?: string[] | string;
  secondaryCmera?: string[] | string;
  dimentions?: string;
  weight?: string;
  colors?: string[];
  internalMemory?: string[];
  options?: {
    colors?: ProductOptionItem[];
    storages?: ProductOptionItem[];
  };
  [key: string]: unknown;
}

export interface CartResponse {
  count: number;
}
