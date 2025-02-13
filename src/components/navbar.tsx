import { axiosInstance } from "@/lib/utils";
import { Store } from "@/types/types-db";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";

const Navbar = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    const fetchStores = async () => {
      try {
        const { data } = await axiosInstance.post("/stores/all", {
          userId,
        });
        if (data?.success) {
          console.log(data);
          setStores(data?.data?.stores || []);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />

        <MainNav />

        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
