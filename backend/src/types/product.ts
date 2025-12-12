// Product DTO for application communication

export interface Product {
  id: number;
  name: string;
  brand: string;

  category: string;
  labels: string[];
  skinType: string[];
  country: string;
  capacity: string;
  price: number;

  instructions: string[];
  activeIngredient?: string[];
  ingredients?: string;
  imageUrls?: string[];
  averageRating: number;
  reviewCount: number;
  tags?: string[];
}

export type ProductCategory =
  | "cleanser"
  | "toner"
  | "essence"
  | "serum"
  // | "eye cream"
  | "moisturizer"
  | "sunscreen"
  | "other";

export type SkinType =
  | "oily"
  | "dry"
  | "combination"
  | "sensitive"
  | "normal"
  | "acne-prone";
