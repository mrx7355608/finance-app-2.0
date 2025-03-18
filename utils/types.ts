export type IRecordModel = {
  id: number;
  image: string;
  name: string;
  createdAt: string;
  bought_price: number;
  sold_price: number | null | undefined;
};

export type IRecordInput = {
  image: string;
  name: string;
  bought_price: number;
  sold_price?: number | null | undefined;
};

export interface IExpenseInput {
  name: string;
  amount: number;
  recordId: number;
}

export interface IExpense extends IExpenseInput {
  id: number;
  createdAt: string;
}
