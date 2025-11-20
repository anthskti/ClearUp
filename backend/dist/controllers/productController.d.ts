import { Request, Response } from "express";
export declare class ProductController {
    private productService;
    constructor();
    getAllProducts(req: Request, res: Response): Promise<void>;
    getProductsByCategory(req: Request, res: Response): Promise<void>;
    getProductById(req: Request, res: Response): Promise<void>;
    createProduct(req: Request, res: Response): Promise<void>;
    updateProductbyId(req: Request, res: Response): Promise<void>;
    DeleteProductbyId(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ProductController.d.ts.map