export interface Store {
    _id: string
    name: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface BillBoard {
    _id: string,
    label: string,
    imageUrl: string,
    createdAt: Date,
    updatedAt: Date,
}