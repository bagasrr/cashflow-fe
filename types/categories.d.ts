export interface ICategories {
  id: string;
  user_id: string | null;
  group_id?: string | null;
  name: string;
  type: string;
}
