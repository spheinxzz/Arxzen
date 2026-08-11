export function formatUsername(username) {
  if (!username) {
    return "";
  }

  return username.startsWith("@")
    ? username
    : `@${username}`;
}

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}