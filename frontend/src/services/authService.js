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

  if (!user) {
    return [];
  }

  return [user];
}

export async function isLoggedIn() {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}

export function loginWithGoogle(options = {}) {
  const mode = options.mode || "login";
  const testerCode = options.testerCode || "";

  const params = new URLSearchParams();

  params.set("mode", mode);

  if (testerCode) {
    params.set("testerCode", testerCode);
  }

  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/google?${params.toString()}`;
}

export function loginWithDiscord(options = {}) {
  const mode = options.mode || "login";
  const testerCode = options.testerCode || "";

  const params = new URLSearchParams();

  params.set("mode", mode);

  if (testerCode) {
    params.set("testerCode", testerCode);
  }

  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/discord?${params.toString()}`;
}

export function restoreOAuthSession() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const accessToken =
    params.get("access_token");

  const refreshToken =
    params.get("refresh_token");

  if (accessToken) {
    localStorage.setItem(
      "arxzen_access_token",
      accessToken
    );
  }

  if (refreshToken) {
    localStorage.setItem(
      "arxzen_refresh_token",
      refreshToken
    );
  }

  return {
    accessToken,
    refreshToken
  };
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
