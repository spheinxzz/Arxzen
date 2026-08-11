import { apiRequest } from "./api";

export async function getConversations() {
  return apiRequest("/conversations");
}

export async function getConversation(id) {
  return apiRequest(`/conversations/${id}`);
}

export async function createConversation({
  type = "direct",
  name = null,
  avatarUrl = null,
  participantIds = []
}) {
  return apiRequest("/conversations", {
    method: "POST",
    body: JSON.stringify({
      type,
      name,
      avatarUrl,
      participantIds
    })
  });
}

export async function deleteConversation(id) {
  return apiRequest(`/conversations/${id}`, {
    method: "DELETE"
  });
}
