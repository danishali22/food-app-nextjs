"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { useAuth } from "@clerk/nextjs";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { storeId } = useParams() as { storeId: string };
  const { userId } = useAuth();
  const router = useRouter();
  const [store, setStore] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!userId) {
    //   router.push("/sign-in");
    //   return;
    // }

    // if (!storeId) {
    //   router.push("/");
    //   return;
    // }

    const fetchStore = async () => {
      try {
        const { data } = await axiosInstance.post("/stores/user-store", {
          userId,
          storeId,
        });

        // if (!data?.data) {
        //   router.push("/");
        //   return;
        // }

        setStore(data?.data);
      } catch (error) {
        console.error("Error fetching store:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [userId, storeId, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
