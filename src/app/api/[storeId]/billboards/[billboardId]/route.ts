import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import { errorResponse, successResponse } from '@/lib/responseHelper';
import dbConnect from '@/lib/dbConnect';
import BillboardModel from '@/models/Billboard';

export async function PATCH(req: Request, { params }: { params: { storeId: string, billBoardId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        const { storeId, billBoardId } = params;
        if (!storeId) {
            return errorResponse("Store Id is missing", 400);
        }
        if (!billBoardId) {
            return errorResponse("billBoard Id is missing", 400);
        }

        const { label, imageUrl } = await req.json();

        await dbConnect();

        const billBoard = await BillboardModel.findOne({ _id: billBoardId, storeId, userId });
        if (!billBoard) {
            return errorResponse("Store not found or you don't have permission", 404);
        }

        if (billBoard.userId !== userId) {
            return errorResponse("You don't have permission to update this store", 403);
        }

        billBoard.label = label;
        billBoard.imageUrl = imageUrl;
        billBoard.updatedAt = new Date();

        await billBoard.save();

        return successResponse("Store updated successfully", 200, billBoard);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
};

export async function DELETE(req: Request, { params }: { params: { storeId: string, billBoardId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        const { storeId, billBoardId } = params;
        if (!storeId) {
            return errorResponse("Store Id is missing", 400);
        }
        if (!billBoardId) {
            return errorResponse("billBoard Id is missing", 400);
        }

        await dbConnect();

        const billBoard = await BillboardModel.findOne({ _id: billBoardId, storeId, userId });
        if (!billBoard) {
            return errorResponse("Billboard not found or you don't have permission", 404);
        }

        if (billBoard.userId !== userId) {
            return errorResponse("You don't have permission to update this store", 403);
        }

        await BillboardModel.deleteOne({ _id: billBoardId });

        return successResponse("Billboard deleted successfully", 200);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
};