export interface IGroup {
  id: string;
  name: string;
  description?: string;
  wallet: IWallet[];
  members: IGroupMembers[];
}
