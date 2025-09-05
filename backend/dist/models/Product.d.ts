import { Model, Optional } from "sequelize";
interface ProductAttributes {
    id: number;
    name: string;
    brand: string;
    category: string;
    skinTypes: string[];
    benefits?: string;
    ingredients?: string;
    country?: string;
    imageUrls?: string[];
    averageRating?: number;
    reviewCount?: number;
    tags?: string[];
}
interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {
}
declare class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    id: number;
    name: string;
    brand: string;
    category: string;
    skinTypes: string[];
    benefits: string;
    ingredients: string;
    country: string;
    imageUrls: string[];
    averageRating?: number;
    reviewCount?: number;
    tags?: string[];
}
export default Product;
//# sourceMappingURL=Product.d.ts.map