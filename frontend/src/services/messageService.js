import { apiRequest } from "./api";

export async function getMessages(conversationId) {
  return apiRequest(
    `/messages/${conversationId}`
  );
}

export async function sendMessage({
  conversationId,
  content,
  messageType = "text"
}) {
  return apiRequest("/messages", {
    method: "POST",
    body: JSON.stringify({
      conversationId,
      content,
      messageType
    })
  });
}

export async function editMessage(
  messageId,
  content
) {
  return apiRequest(
    `/messages/${messageId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        content
      })
    }
  );
}

export async function deleteMessage(messageId) {
  return apiRequest(
    `/messages/${messageId}`,
    {
      method: "DELETE"
    }
  );
}
