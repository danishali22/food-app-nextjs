import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import { errorResponse, successResponse } from '@/lib/responseHelper';
import StoreModel from '@/models/Store';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(req: Request, {params}: {params: {storeId: string}}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        const { storeId } = params;

        if (!storeId) {
            return errorResponse("Store Id is missing", 400);
        }

        const { name } = await req.json();

        await dbConnect();

        const store = await StoreModel.findOne({_id: storeId, userId});
        if (!store) {
            return errorResponse("Store not found or you don't have permission", 404);
        }

        if (store.userId !== userId) {
            return errorResponse("You don't have permission to update this store", 403);
        }

        store.name = name;

        await store.save();

        return successResponse("Store updated successfully", 200, store);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
};

export async function DELETE(req: Request, {params}: {params: {storeId: string}}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        const { storeId } = params;

        if (!storeId) {
            return errorResponse("Store Id is missing", 400);
        }

        await dbConnect();

        const store = await StoreModel.findOne({_id: storeId, userId});
        if (!store) {
            return errorResponse("Store not found or you don't have permission", 404);
        }

        if (store.userId !== userId) {
            return errorResponse("You don't have permission to delete this store", 403);
        }

        await StoreModel.deleteOne({ _id: storeId });

        return successResponse("Store deleted successfully", 200);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
};