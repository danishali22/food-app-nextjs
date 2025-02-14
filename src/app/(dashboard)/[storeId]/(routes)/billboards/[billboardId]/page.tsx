import BillboardsForm from "./components/billboards-form"

const BillboardPage = async({params}: {params: {storeId: string, billboardId: string}}) => {
    const billboard = {
        _id: "",
        label: "",
        imageUrl: "",
    }
    // const billboard = {
    //     _id: "bill123",
    //     label: "Billboard Label",
    //     imageUrl: "hrgsdsdf",
    // }
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardsForm initialData={billboard} />
        </div>
    </div>
  )
}

export default BillboardPage