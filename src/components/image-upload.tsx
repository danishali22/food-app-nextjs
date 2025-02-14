"use client"

import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {PuffLoader} from "react-spinners"
import { Button } from "./ui/button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload = ({disabled, onChange, onRemove, value}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (e: any) => {
        const file = e.target.files[0];
        setIsLoading(true);
    }

    const onDelete = () => {
        console.log("delete");
    }

  return (
    <div>
      {value && value.length > 0 ? (
        <>
            <div className="mb-4 flex items-center gap-4">
            { value.map((url) => (
                    <div className="relative w-52 h-52 rounded-md overflow-hidden" key={url}>
                        <Image fill className="object-cover" alt="Billboard Image" src={url} />
                        <div className="absolute z-10 top-2 right-2">
                            <Button type="button" variant={"destructive"} size={"icon"} onClick={onDelete}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )) }
            </div>

        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader size={30} color="#555" />
              <p>{`${progress.toFixed(2)}%`}</p>
            </>
          ) : (
            <>
              <label>
                <div className="h-full w-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="h-4 w-4" />
                  <p>Upload an image</p>
                </div>
                <input type="file" accept="image/+" className="" onChange={onUpload} />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload