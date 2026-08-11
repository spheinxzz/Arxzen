const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://arxzen.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(
    "arxzen_access_token"
  );

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("API connection error:", error);

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
    const message =
      data?.error?.message ||
      data?.message ||
      data?.error ||
      `Request failed with HTTP ${response.status}.`;

    const code =
      data?.error?.code ||
      data?.code ||
      `ARX-API-${response.status}`;

    const error = new Error(`${code}: ${message}`);

    error.code = code;
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}