import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(files: string[]): Promise<{ public_id: string, url: string }[]> {
    const uploads = files.map(file => cloudinary.uploader.upload(file));
    const results = await Promise.all(uploads);
    return results.map(({ public_id, secure_url }) => ({ public_id, url: secure_url }));
}

export async function deleteFromCloudinary(publicIds: string[]): Promise<void> {
    const deletions = publicIds.map(id => cloudinary.uploader.destroy(id));
    await Promise.all(deletions);
}