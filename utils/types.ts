export type IRecordModel = {
  id: number;
  image: string;
  name: string;
  createdAt: string;
  bought_price: number;
  sold_price: number | null;
};

export type IRecordInput = {
  image: string;
  name: string;
  bought_price: number;
  sold_price?: number;
};
