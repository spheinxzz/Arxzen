import { apiRequest } from "./api";

export async function getSession() {
  return apiRequest("/auth/session");
}

export async function getSessionUser() {
  const data = await getSession();
  return data.user || null;
}

export async function getSessions() {
  return apiRequest("/security/sessions");
}

export async function revokeSession(sessionId) {
  return apiRequest(
    `/security/sessions/${sessionId}`,
    {
      method: "DELETE"
    }
  );
}

export function clearSession() {
  localStorage.removeItem("arxzen_access_token");
  localStorage.removeItem("arxzen_session");
}

export function isAuthenticated() {
  return !!localStorage.getItem(
    "arxzen_access_token"
  );
}

export function createSession(user) {
  if (!user) {
    return null;
  }

  const session = {
    id: user.id || user.user_id || null,
    username: user.username || "",
    email: user.email || "",
    createdAt: Date.now()
  };

  localStorage.setItem(
    "arxzen_session",
    JSON.stringify(session)
  );

  return session;
}

export function getLocalSession() {
  const raw = localStorage.getItem(
    "arxzen_session"
  );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearSession();
    return null;
  }
}
