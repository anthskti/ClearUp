export interface Product {
    id: number;
    name: string;
    brand: string;
    category: ProductCategory;
    skinTypes: SkinType[];
    benefits: string;
    ingredients: string;
    country: string;
    imageUrls: string[];
    averageRating: number;
    reviewCount: number;
    tags: string[];
}
export type ProductCategory = "Cleanser" | "Toner" | "Essence" | "Serum" | "Eye Cream" | "Moisturizer" | "Sunscreen" | "Other";
export type SkinType = "oily" | "dry" | "combination" | "sensitive" | "normal" | "acne-prone";
//# sourceMappingURL=product.d.ts.map