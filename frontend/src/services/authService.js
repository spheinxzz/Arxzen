import { apiRequest } from "./api";

/*
|--------------------------------------------------------------------------
| Registration
|--------------------------------------------------------------------------
*/

export async function register({
  email,
  password,
  username,
  displayName,
  testerCode
}) {
  return apiRequest(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        username,
        displayName,
        testerCode
      })
    }
  );
}

export async function registerAccount(
  account
) {
  return register(account);
}

/*
|--------------------------------------------------------------------------
| Password Login
|--------------------------------------------------------------------------
*/

export async function login(
  email,
  password
) {
  const data =
    await apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      }
    );

  if (
    data?.session?.access_token
  ) {
    localStorage.setItem(
      "arxzen_access_token",
      data.session.access_token
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logout() {
  try {
    return await apiRequest(
      "/auth/logout",
      {
        method: "POST"
      }
    );
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

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

export async function getSession() {
  return apiRequest(
    "/auth/session"
  );
}

export async function getCurrentUser() {
  const data =
    await getSession();

  return data?.user || null;
}

export async function getCurrentAccounts() {
  const user =
    await getCurrentUser();

  if (!user) {
    return [];
  }

  return [user];
}

export async function isLoggedIn() {
  try {
    const user =
      await getCurrentUser();

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

export async function loginWithGoogle(
  options = {}
) {
  const mode =
    options.mode || "login";

  const testerCode =
    options.testerCode || "";

  const params =
    new URLSearchParams();

  params.set("mode", mode);

  /*
   * Tester code is only sent when registering.
   */

  if (
    mode === "register" &&
    testerCode
  ) {
    params.set(
      "testerCode",
      testerCode
    );
  }

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/google?${params.toString()}`;
}

/*
|--------------------------------------------------------------------------
| Discord OAuth
|--------------------------------------------------------------------------
*/

export async function loginWithDiscord(
  options = {}
) {
  const mode =
    options.mode || "login";

  const testerCode =
    options.testerCode || "";

  const params =
    new URLSearchParams();

  params.set("mode", mode);

  if (
    mode === "register" &&
    testerCode
  ) {
    params.set(
      "testerCode",
      testerCode
    );
  }

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "/api";

  window.location.href =
    `${baseUrl}/auth/oauth/discord?${params.toString()}`;
}

/*
|--------------------------------------------------------------------------
| Password reset
|--------------------------------------------------------------------------
*/

export async function forgotPassword(
  email
) {
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

/*
|--------------------------------------------------------------------------
| Email verification
|--------------------------------------------------------------------------
*/

export async function verifyEmail(
  token
) {
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
