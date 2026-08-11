import { apiRequest } from "./api";

export async function getUser(userId) {
  return apiRequest(`/users/${userId}`);
}

export async function searchUsers(query) {
  return apiRequest(
    `/users/search?q=${encodeURIComponent(query)}`
  );
}
