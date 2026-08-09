import { ITransaction } from "./transaction";

export interface IWallet {
  id: string;
  balance: number;
  name: string;
  group_id: string | null;
  user_id: string | null;
  transaction_count: number;
  transactions: ITransaction[];
}
