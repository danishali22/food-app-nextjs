import { auth } from '@clerk/nextjs/server';
import { errorResponse, successResponse } from '@/lib/responseHelper';
import BillboardModel from '@/models/Billboard';
import dbConnect from '@/lib/dbConnect';

export const POST = async (req: Request, {params}: {params: {storeId: string}}) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        const { storeId } = params;

        if (!storeId) {
            return errorResponse("Store Id is missing", 400);
        }

        const { label, imageUrl } = await req.json();

        if (!label || !imageUrl) {
            return errorResponse("Billboard label and image is required");
        }

        await dbConnect();

        const newBillboard = new BillboardModel({
            label,
            imageUrl,
            storeId,
            userId,
        });

        await newBillboard.save();

        return successResponse("Billboard created successfully", 201, newBillboard);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
}

export const GET = async (req: Request, {params}: {params: {storeId: string}}) => {
    try {
        const { storeId } = params;

        if (!storeId) {
            return errorResponse("Store Id is missing", 400);
        }

        await dbConnect();
        const billBoardsData = await BillboardModel.find({ storeId }).sort({ createdAt: -1 });

        return successResponse("Billboards fetched successfully", 200, billBoardsData);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
}