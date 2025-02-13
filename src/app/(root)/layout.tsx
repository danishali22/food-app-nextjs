"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

interface SetupLayoutProps {
  children: React.ReactNode;
}

const SetupLayout = ({ children }: SetupLayoutProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const fetchLatestStore = async () => {
      try {
        const { data } = await axiosInstance.post("/stores/all", {
          userId,
        });
        const latestStore = data?.data?.latestStore;

        if (latestStore) {
          router.push(`/${latestStore._id}`);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestStore();
  }, [userId, router]);

  if (loading) return <p>Loading...</p>;

  return <div>{children}</div>;
};

export default SetupLayout;
