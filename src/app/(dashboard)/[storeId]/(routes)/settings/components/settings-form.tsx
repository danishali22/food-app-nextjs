"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Store } from "@/models/Store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/utils";
import toast from "react-hot-toast";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name should be minimum 3 characters" }),
});

const SettingsForm = ({ initialData }: SettingsFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const onSubmit = async(data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.patch(`/stores/${params.storeId}`, data);
            if(response?.data?.success){
                toast.success(response?.data?.message || "Store updated!");
                // router.refresh();
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button variant={"destructive"} size={"icon"}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-3"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your store name..."
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
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

export default SettingsForm;
