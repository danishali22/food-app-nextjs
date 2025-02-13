"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingsForm from "./components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const store = {
  _id: "67acab183a33ca28670d53f6",
  name: "store7",
  userId: "user123",
};

const Settings = ({ params }: SettingsPageProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    } else {
      setLoading(false);
    }
  }, [userId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-5 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default Settings;
