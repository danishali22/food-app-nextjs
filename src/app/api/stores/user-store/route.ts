import { errorResponse, successResponse } from '@/lib/responseHelper';
import StoreModel from '@/models/Store';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
    try {
        const { userId, storeId } = await req.json();

        if (!userId || !storeId) {
            return errorResponse("User Id and Store Id are required", 400);
        }

        await dbConnect();

        const store = await StoreModel.findOne({ _id: storeId, userId });

        if (!store) {
            return errorResponse("Store not found or does not belong to the user", 404);
        }

        return successResponse("Store fetched successfully", 200, store);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
}
