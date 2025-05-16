export type IRecordInput = {
  images: string[];
  name: string;
  bought_price: number;
  sold_price?: number | null | undefined;
};

export interface IRecordModel extends IRecordInput {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface IExpenseInput {
  name: string;
  amount: number;
  recordId: number;
}

export interface IExpense extends IExpenseInput {
  id: number;
  createdAt: string;
}

export interface Database {
  public: {
    Tables: {
      records: { Row: IRecordModel };
      expenses: { Row: IExpense };
    };
  };
}
