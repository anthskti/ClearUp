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
  | "Cleanser"
  | "Toner"
  | "Essence"
  | "Serum"
  | "Eye Cream"
  | "Moisturizer"
  | "Sunscreen"
  | "Other";

export type SkinType =
  | "oily"
  | "dry"
  | "combination"
  | "sensitive"
  | "normal"
  | "acne-prone";
