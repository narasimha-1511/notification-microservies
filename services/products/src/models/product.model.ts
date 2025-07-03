import mongoose from "mongoose";

interface Product extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema<Product>({
    name: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number, 
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true});

const Product = mongoose.model<Product>("Product", productSchema);

export default Product;