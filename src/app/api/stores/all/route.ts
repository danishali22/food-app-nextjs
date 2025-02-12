import dbConnect from '@/lib/dbConnect';
import { errorResponse, successResponse } from '@/lib/responseHelper';
import StoreModel from '@/models/Store';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        await dbConnect();

        const stores = await StoreModel.find({ userId }).sort({ createdAt: -1 });

        return successResponse("Stores fetched successfully", 200, {
            stores,
            latestStore: stores.length > 0 ? stores[0] : null,
        });
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
}
