import { Product, ProductCategory, SkinType } from "../types/product";
export declare class ProductRepository {
    findAll(): Promise<Product[]>;
    findByCategory(category: ProductCategory): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    create(productData: {
        name: string;
        brand: string;
        category: ProductCategory;
        skinTypes: SkinType[];
        benefits: string;
        ingredients: string;
        country: string;
        imageUrls: string[];
        tags: string[];
    }): Promise<Product>;
    update(id: number, updates: Partial<{
        name: string;
        brand: string;
        category: ProductCategory;
        skinTypes: SkinType[];
        benefits: string;
        ingredients: string;
        country: string;
        imageUrls: string[];
        tags: string[];
    }>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
    private mapToProductType;
}
//# sourceMappingURL=ProductRepository.d.ts.map