const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://arxzen.onrender.com/api";

export async function apiRequest(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("arxzen_access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
        credentials: "include",
      }
    );
  } catch (error) {
    throw new Error(
      "ARX-NET-001: Unable to connect to the Arxzen server."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `ARX-NET-${response.status}: Arxzen server returned HTTP ${response.status}.`
    );
  }

  return data;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
