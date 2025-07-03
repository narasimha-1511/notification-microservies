import mongoose from "mongoose";
import { string } from "zod";

export type UserPreferences = 'PROMOTIONS' | 'NEWSLETTER' | 'ORDER_UPDATES' | 'RECOMMENDATIONS';

interface INotification extends mongoose.Document {
    userId: string;
    type: UserPreferences[];
    content: string;
    read: boolean;
    sentAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
    userId:{
        required: true,
        type: String,
    },
    type:{
        required: true,
        type: [String],
        enum: ['PROMOTIONS', 'NEWSLETTER', 'ORDER_UPDATES', 'RECOMMENDATIONS'],
    },
    content:{
        required: true,
        type: String,
    },
    read:{
        required: true,
        type: Boolean,
        default: false,
    },
    sentAt: {
        required: true,
        type: Date,
        default: Date.now,
    }
});

notificationSchema.index({ userId: 1, type: 1 , read: 1 });

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;