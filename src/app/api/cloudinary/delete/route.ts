import { errorResponse, successResponse } from "@/lib/responseHelper";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request, {params}: {params: {storeId: string}}) {
    const { userId } = await auth();
    
    if (!userId) {
        return errorResponse("Unauthorized", 401);
    }
    
    const url = new URL(req.url);
    const public_id = url.searchParams.get('public_id');
    
    if (!public_id || typeof public_id !== 'string') {
        return errorResponse("Missing or invalid public_id", 400);
        
    }
    try {
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result !== 'ok') {
            return errorResponse("Failed to delete imager", 400);
        }

        return successResponse("Image deleted successfully", 200, result);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return errorResponse("Internal Server Error", 500);
    }
};