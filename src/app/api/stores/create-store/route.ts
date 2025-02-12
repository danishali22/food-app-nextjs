import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import { errorResponse, successResponse } from '@/lib/responseHelper';
import StoreModel from '@/models/Store';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", 401);
        }

        const { name } = await req.json();

        if (!name) {
            return errorResponse("Store name is required");
        }

        await dbConnect();

        const newStore = new StoreModel({
            name,
            userId
        });

        await newStore.save();

        return successResponse("Store created successfully", 201, newStore);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
};