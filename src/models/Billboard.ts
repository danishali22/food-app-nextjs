import mongoose, { Schema, Document } from "mongoose";

export interface Billboard extends Document {
    label: string;
    imageUrl: string;
    storeId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const BillboardSchema: Schema<Billboard> = new Schema(
    {
        label: {
            type: String,
            required: [true, "Billboard label is required"],
            trim: true,
            unique: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Billboard image is required"],
            trim: true,
        },
        storeId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const BillboardModel = (mongoose.models.Billboard as mongoose.Model<Billboard>) || mongoose.model<Billboard>("Billboard", BillboardSchema);

export default BillboardModel;
