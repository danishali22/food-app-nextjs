import { ImagePlus, Trash, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import axios from "axios";
import toast from "react-hot-toast";

interface ImageUploadProps {
  disabled?: boolean;
  /** If true, allows multiple image uploads */
  multiple?: boolean;
  /**
   * When multiple is false, value should be a string; when true, an array of strings.
   */
  value: string | string[];
  /**
   * Callback when images are successfully uploaded.
   * Returns a single URL and File if multiple is false, or arrays if multiple is true.
   */
  onChange: (urls: string | string[], files: File | File[]) => void;
  /**
   * Callback to remove an image.
   * When multiple is false, pass an empty string; when true, pass the index of the image,
   * or pass -1 to indicate that all images have been removed.
   */
  onRemove: (value: string | number) => void;
}

/** Internal type to store image data along with Cloudinary’s public_id */
interface UploadedImage {
  url: string;
  public_id: string;
}

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dyzpyjgaw";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  "cloud-image";

/**
 * ImageUpload component handles direct uploads to Cloudinary.
 * It supports both single and multiple image uploads.
 * When an image is deleted, it calls a backend endpoint to remove the image from Cloudinary.
 */
const ImageUpload = ({
  disabled,
  multiple = false,
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  // Convert incoming value to an array for local state handling.
  const initialImages: UploadedImage[] = Array.isArray(value)
    ? value.map((url) => ({ url, public_id: "" }))
    : value
    ? [{ url: value, public_id: "" }]
    : [];

  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  // Track the index of the image currently being deleted.
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const uploadFileToCloudinary = async (
    file: File,
    onProgress: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        onProgress(percentCompleted);
      },
    });
    return response.data;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsLoading(true);
    try {
      const uploadedImages: UploadedImage[] = [];
      // Sequentially upload each file to Cloudinary.
      for (const file of files) {
        const result = await uploadFileToCloudinary(file, (prog) =>
          setProgress(prog)
        );
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      // When not multiple, only take the first image.
      const finalImages = multiple ? uploadedImages : [uploadedImages[0]];
      setImages(finalImages);
      // Call onChange callback accordingly.
      if (multiple) {
        onChange(
          finalImages.map((img) => img.url),
          files
        );
      } else {
        onChange(finalImages[0].url, files[0]);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      toast.error("Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (index?: number) => {
    if (typeof index !== "number") {
      // Remove all images.
      setImages([]);
      // When multiple, pass -1 to indicate all images have been removed.
      onRemove(multiple ? -1 : "");
      return;
    }

    const imageToRemove = images[index];

    // If the image has a public_id, attempt deletion from Cloudinary.
    if (imageToRemove.public_id) {
      setDeletingIndex(index);
      try {
        const response = await axios.delete(
          `/api/cloudinary/delete?public_id=${imageToRemove.public_id}`
        );
        if (response.data?.success) {
          toast.success("Image deleted successfully");
        } else {
          toast.error("Failed to delete image");
          setDeletingIndex(null);
          return;
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        toast.error("Error deleting image");
        setDeletingIndex(null);
        return;
      }
    }

    // Remove the image from local state.
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    // Call onRemove callback accordingly.
    if (multiple) {
      onRemove(index);
    } else {
      onRemove("");
    }
    setDeletingIndex(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className="relative w-52 h-52 rounded-md overflow-hidden"
            >
              <Image
                src={image.url}
                alt="Uploaded"
                fill
                style={{ objectFit: "cover" }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-8 w-8"
                onClick={() => handleRemove(index)}
                disabled={deletingIndex === index}
              >
                {deletingIndex === index ? (
                  <PuffLoader size={12} color="#fff" />
                ) : (
                  <Trash className="h-6 w-6" />
                )}
              </Button>
            </div>
          ))
        ) : (
          <label className="h-52 w-52 cursor-pointer border-dashed border-2 rounded-md p-4 flex flex-col items-center justify-center gap-2">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <PuffLoader size={30} color="#555" />
                <p>{`${progress.toFixed(0)}%`}</p>
              </div>
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <p className="text-sm">Upload Image{multiple ? "s" : ""}</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              disabled={disabled}
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
