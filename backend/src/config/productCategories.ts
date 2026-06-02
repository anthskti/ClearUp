export const PRODUCT_CATEGORY_VALUES = [
    "cleanser",
    "toner",
    "essence",
    "serum",
    // "eye-cream",      
    // "lip-balm",
    // "makeup-remover",
    "moisturizer",
    "sunscreen",
    "other",
  ] as const;
  
  export type ProductCategory = (typeof PRODUCT_CATEGORY_VALUES)[number];