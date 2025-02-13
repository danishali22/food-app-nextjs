"use client"

import { useAuth } from "@clerk/nextjs";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";
import SettingsForm from "./components/settings-form";

interface SettingsPageProps {
  params : {
    storeId: string
  }
}

const store = {
  _id: "storeid12",
  name: "store7",
  userId: "user123"
}

const Settings = ({params}: SettingsPageProps) => {
  const {userId} = useAuth();
  const router = useRouter();
  if (!userId) {
    router.push("/sign-in");
    return;
  }

  // if(!store || store.userId !=== userId) redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-5 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>

    </div>
  )
}

export default Settings