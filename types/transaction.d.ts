import { ICategories } from "./categories";
import { IUser } from "./user";

export interface ITransaction {
  id: string;
  title: string;
  amount: number;
  description?: string; // Opsional
  date: string;
  category: ICategories;
  user?: IUser;
}
