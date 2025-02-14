"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/utils";
import toast from "react-hot-toast";
import AlertModal from "@/modal/alert-modal";
import { BillBoard } from "@/types/types-db";
import ImageUpload from "@/components/image-upload";

interface BillboardsFormProps {
  initialData: BillBoard;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

const BillboardsForm = ({ initialData }: BillboardsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard Created";
  const action = initialData ? "Save Changes" : "Create Billboard"

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    let response;
    try {
      if(initialData){
        response = await axiosInstance.patch(
          `/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        response = await axiosInstance.post(`/${params.storeId}/billboards`, data);
      }
      if (response?.data?.success) {
        toast.success(response?.data?.message || "Billboard created!");
      }
    } catch (error) {
      console.error("Error fetching billboard:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`/${params.storeId}/billboards/${params.billboardId}`);
      if (response?.data?.success) {
        toast.success(response?.data?.message || "Store deleted!");
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
            disabled={isLoading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-3"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value ? [field.value] : []} disabled={isLoading} onChange={(url)=>{field.onChange(url)}} onRemove={()=>{field.onChange("")}} />
                </FormControl>
                {form.formState.errors.label && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.label.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your billboard label..."
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.label && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.label.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} size={"sm"}>
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardsForm;
