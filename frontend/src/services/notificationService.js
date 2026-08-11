import { apiRequest } from "./api";

export async function getNotifications() {
  return apiRequest("/notifications");
}

export async function markNotificationRead(
  notificationId
) {
  return apiRequest(
    `/notifications/${notificationId}/read`,
    {
      method: "PATCH"
    }
  );
}

export async function deleteNotification(
  notificationId
) {
  return apiRequest(
    `/notifications/${notificationId}`,
    {
      method: "DELETE"
    }
  );
}
