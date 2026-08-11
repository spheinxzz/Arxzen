import { apiRequest } from "./api";

export async function register({
  email,
  password,
  username,
  displayName,
  testerCode
}) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      username,
      displayName,
      testerCode
    })
  });
}

export async function registerAccount({
  email,
  password,
  username,
  displayName,
  testerCode
}) {
  return register({
    email,
    password,
    username,
    displayName,
    testerCode
  });
}

export async function login(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

  if (data?.session?.access_token) {
    localStorage.setItem(
      "arxzen_access_token",
      data.session.access_token
    );
  }

  if (data?.session?.refresh_token) {
    localStorage.setItem(
      "arxzen_refresh_token",
      data.session.refresh_token
    );
  }

  return data;
}

export async function logout() {
  try {
    return await apiRequest("/auth/logout", {
      method: "POST"
    });
  } finally {
    localStorage.removeItem(
      "arxzen_access_token"
    );

    localStorage.removeItem(
      "arxzen_refresh_token"
    );

    localStorage.removeItem(
      "arxzen_session"
    );
  }
}

export async function getSession() {
  return apiRequest("/auth/session");
}

export async function getCurrentUser() {
  const data = await getSession();
  return data?.user || null;
}

export async function getCurrentAccounts() {
  const user = await getCurrentUser();

  return user ? [user] : [];
}

export async function isLoggedIn() {
  try {
    return !!(await getCurrentUser());
  } catch {
    return false;
  }
}

export function loginWithGoogle() {
  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/google`;
}

export function loginWithDiscord() {
  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/discord`;
}

export async function completeOAuthSession(
  accessToken,
  refreshToken
) {
  if (!accessToken) {
    throw new Error(
      "ARX-OAUTH-FRONTEND-001: OAuth access token is missing."
    );
  }

  localStorage.setItem(
    "arxzen_access_token",
    accessToken
  );

  if (refreshToken) {
    localStorage.setItem(
      "arxzen_refresh_token",
      refreshToken
    );
  }

  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  const response = await fetch(
    `${baseUrl}/auth/oauth/session`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    localStorage.removeItem(
      "arxzen_access_token"
    );

    localStorage.removeItem(
      "arxzen_refresh_token"
    );

    throw new Error(
      data?.error ||
        "ARX-OAUTH-FRONTEND-002: OAuth authentication failed."
    );
  }

  return data;
}

export async function forgotPassword(email) {
  return apiRequest(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({
        email: email.trim()
      })
    }
  );
}

export async function resetPassword(
  token,
  password
) {
  return apiRequest(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({
        token,
        password
      })
    }
  );
}

export async function verifyEmail(token) {
  return apiRequest(
    "/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify({
        token
      })
    }
  );
}

export async function resendVerificationEmail(
  email
) {
  return apiRequest(
    "/auth/resend-verification",
    {
      method: "POST",
      body: JSON.stringify({
        email: email.trim()
      })
    }
  );
}

export async function updatePassword(
  currentPassword,
  newPassword
) {
  return apiRequest(
    "/auth/password",
    {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    }
  );
}

export async function enableTwoFactor() {
  return apiRequest(
    "/auth/2fa/enable",
    {
      method: "POST"
    }
  );
}

export async function disableTwoFactor() {
  return apiRequest(
    "/auth/2fa/disable",
    {
      method: "POST"
    }
  );
}
