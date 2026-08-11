import { apiRequest } from "./api";

export async function getRequests() {
  return apiRequest("/requests");
}

export async function sendRequest(
  userId,
  message = null
) {
  return apiRequest(`/requests/${userId}`, {
    method: "POST",
    body: JSON.stringify({
      message
    })
  });
}

export async function updateRequest(
  requestId,
  status
) {
  return apiRequest(`/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify({
      status
    })
  });
}
