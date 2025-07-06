import { Request, Response } from "express";
import logger from "../utils/logger";
import Product from "../models/product.model";
import { getEnv } from "../config/env";

export const getAllProducts = async (req: Request , res: Response) => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        const result = {
            products: products.map((product) => ({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                createdAt: product.createdAt,
            })),
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            limit
        };

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            result
        });
    } catch (error) {
        logger.error(`Error fetching products ${error}`);
        res.status(500).json({
            success: false,
            message: "Error fetching products"
        });
    }
}

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {

        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                createdAt: product.createdAt,
            }
        });

    } catch (error) {
        logger.error(`Error fetching product ${error}`);
        res.status(500).json({
            success: false,
            message: "Error fetching product"
        });
    }
}

export const addProduct = async (req: Request, res: Response): Promise<any> => {
    try {

        const { name, description = "", price, quantity } = req.body;

        const product = await Product.create({ name, description, price, quantity });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                createdAt: product.createdAt,
            }
        });
    } catch (error) {
        logger.error(`Error creating product ${error}`);
        res.status(500).json({
            success: false,
            message: "Error creating product"
        });
    }
}

export const getProductsByIds = async (req: Request, res: Response): Promise<any> => {
    try {
        const ids = req.query.ids;

        const productIds = ids?.toString().split(',') || [];

        if (!productIds.length) {
            return res.status(400).json({
                success: false,
                message: "No product ids provided"
            });
        }

        const products = await Product.find({ _id: { $in: productIds } });

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: products.map((product) => ({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                createdAt: product.createdAt,
            }))
        });
        
    } catch (error) {
        logger.error(`Error fetching products by ids ${error}`);
        res.status(500).json({
            success: false,
            message: "Error fetching products by ids"
        });
    }
}

export const getRecommendations = async (req:Request , res:Response): Promise<any> => {
    try {
    
        const { userIds } = req.body as { userIds: string[] };

        let usersBacthes : string[][] = [];

        for(let i = 0; i < userIds.length; i += 100){
            usersBacthes.push(userIds.slice(i, i + 100));
        }

        const _productsMap = new Map<string, Set<string>>();
        const bestProductsMap = new Map<string, number>();

        for (const batch of usersBacthes){


            const products = await fetch(`${getEnv("ORDERS_SERVICE_URL")}/purchasedProductsByUserIds`, {
                method: "POST",
                body: JSON.stringify({ userIds: batch }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const productsData = await products.json() as {userId: string, products: string[]}[];

            for(const productData of productsData){
                if(_productsMap.has(productData.userId)){
                    for(const product of productData.products){
                        _productsMap.get(productData.userId)!.add(product);
                    }
                }else{
                    _productsMap.set(productData.userId, new Set(productData.products));
                }

                // to get the products purchased by most number of users
                for(const product of productData.products){
                    if(bestProductsMap.has(product)){
                        bestProductsMap.set(product, bestProductsMap.get(product)! + 1);
                    }else{
                        bestProductsMap.set(product, 1);
                    }
                }
            }
        }

        //products purchased by most number of users in ranking order
        const bestProductsMapArray = Array.from(bestProductsMap.entries()).sort((a, b) => b[1] - a[1]);
        const bestProducts = bestProductsMapArray.map((product) => product[0]);
        
        //products purchased by most number of users but not purchased by the user
        const recommendationsMap = new Map<string, string[]>();

        for(const [userId, products] of _productsMap.entries()){
            
            //iterate over best products and get top3
            const recommendations = [];
            for(const product of bestProducts){
                if(!products.has(product)){
                    recommendations.push(product);
                }
                if(recommendations.length === 3){
                    break;
                }
            }

            recommendationsMap.set(userId, recommendations);
        }

        res.status(200).json({
            success: true,
            message: "Recommendations fetched successfully",
            recommendations: Array.from(recommendationsMap.entries())
        });


    } catch (error) {
        logger.error(`Error fetching recommendations ${error}`);
        res.status(500).json({
            success: false,
            message: "Error fetching recommendations"
        });
    }
}
