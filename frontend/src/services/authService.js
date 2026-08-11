import { apiRequest } from "./api";



export async function register({
  email,
  password,
  username,
  displayName,
  testerCode,
}) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      username,
      displayName,
      testerCode,
    }),
  });
}

export async function registerAccount({
  email,
  password,
  username,
  displayName,
  testerCode,
}) {
  return register({
    email,
    password,
    username,
    displayName,
    testerCode,
  });
}

export async function login(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (data?.session?.access_token) {
    localStorage.setItem(
      "arxzen_access_token",
      data.session.access_token
    );
  }

  return data;
}

export async function logout() {
  try {
    return await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    localStorage.removeItem(
      "arxzen_access_token"
    );
  }
}

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Google OAuth
|--------------------------------------------------------------------------
*/

export async function loginWithGoogle(options = {}) {
  const mode =
    options.mode || "login";

  const testerCode =
    options.testerCode || "";

  const params = new URLSearchParams();

  params.set("mode", mode);

  if (testerCode) {
    params.set(
      "testerCode",
      testerCode
    );
  }

  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/google?${params.toString()}`;
}

/*
|--------------------------------------------------------------------------
| Discord OAuth
|--------------------------------------------------------------------------
*/

export async function loginWithDiscord(options = {}) {
  const mode =
    options.mode || "login";

  const testerCode =
    options.testerCode || "";

  const params = new URLSearchParams();

  params.set("mode", mode);

  if (testerCode) {
    params.set(
      "testerCode",
      testerCode
    );
  }

  const baseUrl =
    import.meta.env.VITE_API_URL || "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/discord?${params.toString()}`;
}

/*
|--------------------------------------------------------------------------
| Password Reset
|--------------------------------------------------------------------------
*/

export async function forgotPassword(email) {
  return apiRequest(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
      }),
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
        password,
      }),
    }
  );
}

/*
|--------------------------------------------------------------------------
| Email Verification
|--------------------------------------------------------------------------
*/

export async function verifyEmail(token) {
  return apiRequest(
    "/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
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
        email: email.trim(),
      }),
    }
  );
}

/*
|--------------------------------------------------------------------------
| Password / Security
|--------------------------------------------------------------------------
*/

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
        newPassword,
      }),
    }
  );
}

export async function enableTwoFactor() {
  return apiRequest(
    "/auth/2fa/enable",
    {
      method: "POST",
    }
  );
}

export async function disableTwoFactor() {
  return apiRequest(
    "/auth/2fa/disable",
    {
      method: "POST",
    }
  );
}