import { Product, ProductCategory, SkinType } from "../types/product";
export declare class ProductService {
    private productRepository;
    constructor();
    getAllProducts(): Promise<Product[]>;
    getProductsByCategory(category: ProductCategory): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    createProduct(productData: {
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
    updateProduct(id: number, updates: Partial<{
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
    deleteProduct(id: number): Promise<boolean>;
}
//# sourceMappingURL=ProductService.d.ts.map