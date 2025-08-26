// Product DTO for application communication

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  skin_types: SkinType[];
  benefits: string;
  ingredients: string;
  country: string;
  // might add size later
  image_urls: string[];
  average_rating: number;
  review_count: number;
  tags: string[];
  created_at: Date;
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
