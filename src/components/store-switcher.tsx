"use client";

import { Store } from "@/types/types-db";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronsUpDown, StoreIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StoreListItem from "./store-list-item";
import { useStoreModal } from "@/hooks/use-store-modal";
import CreateNewStoreItem from "./create-store-item";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
  const params = useParams();
  const router = useRouter();
  const storeModal = useStoreModal();

  const formattedStores = items.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const currentStore = formattedStores.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFilterred] = useState<{ label: string; value: string }[]>(
    []
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  const handleSearchStore = (e: any) => {
    setSearchTerm(e.target.value);
    setFilterred(
      formattedStores.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <StoreIcon className="h-4 w-4" />
          {currentStore?.value
            ? formattedStores.find(
                (store) => store.value === currentStore?.value
              )?.label
            : "Select store..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
            <StoreIcon className="min-w-4 h-4 w-4 mr-2" />
            <input
              type="text"
              placeholder="Search store..."
              className="flex-1 w-full outline-none"
              onChange={handleSearchStore}
            />
          </div>
          <CommandList>
            <CommandGroup>
              {searchTerm === "" ? (
                formattedStores.map((item, i) => (
                  <StoreListItem
                    key={i}
                    store={item}
                    onSelect={onStoreSelect}
                    isChecked={currentStore?.value === item?.value}
                  />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <StoreListItem
                    key={i}
                    store={item}
                    onSelect={onStoreSelect}
                    isChecked={currentStore?.value === item?.value}
                  />
                ))
              ) : (
                <CommandEmpty>No store found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
                <CreateNewStoreItem
                    onClick = {() => {
                        setOpen(false);
                        storeModal.onOpen();
                    }}
                />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
