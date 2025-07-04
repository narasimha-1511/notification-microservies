import mongoose from "mongoose";

interface Order extends mongoose.Document {
    userId: string;
    products: {
        id: string;
        quantity: number;
    }[];
    status: "PENDING" | "DELIVERED" | "CANCELLED" | "SHIPPED";
    createdAt: Date;
}

const orderSchema = new mongoose.Schema<Order>({
    userId: {
        type: String, 
        required: true,
    },
    products: {
        type: [{
            id: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "DELIVERED", "CANCELLED" , "SHIPPED"],
        default: "PENDING",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true});

orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model<Order>("Order", orderSchema);

export default Order;