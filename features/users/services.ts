import apiClient from "@/libs/apiClient";

export const UserInfo = async () => {
  const res = await apiClient.get("/users/info");
  return res;
};
