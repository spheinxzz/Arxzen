import { apiRequest } from "./api";

export async function getProfile(userId) {
  return apiRequest(`/profiles/${userId}`);
}

export async function updateProfile(profile) {
  return apiRequest("/profiles", {
    method: "PATCH",
    body: JSON.stringify(profile)
  });
}
