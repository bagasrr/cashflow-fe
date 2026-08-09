import { IWallet } from "./wallet";

export interface IUser {
  id: string;
  email: string;
  username: string;
  user_role: string;
  wallets?: IWallet[];
  avatar?: string;
}
