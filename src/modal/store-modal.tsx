"use client"

import Modal from "@/components/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(3, {message: "Store name should be minimum 3 characters "})
})

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    const onSubmit = async(data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
          const response = await axios.post("/api/stores/create-store", data);
          if(response?.data?.success){
            toast.success(response?.data?.message || "Store created!");
            window.location.assign(`${response?.data?.data?._id}`);
          }
        } catch (error) {
          toast.error("Something went wrong")
          console.log("Error creating store", error);
        } finally{
          setIsLoading(false);
        }
    }

    return (
      <Modal
        title="Create a new store"
        description="Add a new store to manage the products and categories"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
      >
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
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
              <div className="pl-6 space-x-2 flex items-center justify-end w-full mt-2">
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} size={"sm"}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Modal>
    );
}