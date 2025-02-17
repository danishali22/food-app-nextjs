import BillboardClient from "./components/client"
import { BillboardColumns } from "./components/columns";
import {format} from "date-fns"

const BillboardsPage = ({
  params,
}: {
  params: { storeId: string };
}) => {
  const billBoardData = [
      {
        _id: "67b047a59cb06b7d13d50b3e",
        label: "lavl",
        imageUrl:
          "https://res.cloudinary.com/dyzpyjgaw/image/upload/v1739605913/zi9feaou1evj96thze0h.jpg",
        storeId: "67ae20aa4c073f9be5828882",
        userId: "user_2stCMKeCSaxa5NL8vzo4tnXR5KQ",
        createdAt: "2025-02-15T07:52:05.397Z",
    },
  ]

  const formattedBillboards: BillboardColumns[] = billBoardData.map((item) => ({
    id: item._id,
    label: item.label,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt ? format(new Date(item.createdAt), "MMMM do, yyyy") : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage