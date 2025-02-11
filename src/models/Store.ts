import mongoose, { Schema, Document } from "mongoose";

export interface Store extends Document {
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const StoreSchema: Schema<Store> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Store name is required"],
            trim: true,
            unique: true,
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

const StoreModel = (mongoose.models.Store as mongoose.Model<Store>) || mongoose.model<Store>("Store", StoreSchema);

export default StoreModel;
