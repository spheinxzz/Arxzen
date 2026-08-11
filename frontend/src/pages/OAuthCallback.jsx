import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleCallback() {
      try {
        const hash = window.location.hash;

        if (!hash) {
          throw new Error(
            "ARX-OAUTH-001: OAuth session data is missing."
          );
        }

        const params = new URLSearchParams(
          hash.substring(1)
        );

        const accessToken =
          params.get("access_token");

        const refreshToken =
          params.get("refresh_token");

        const expiresIn =
          params.get("expires_in");

        const tokenType =
          params.get("token_type");

        if (!accessToken) {
          throw new Error(
            "ARX-OAUTH-002: Access token is missing."
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

        if (expiresIn) {
          localStorage.setItem(
            "arxzen_token_expires_in",
            expiresIn
          );
        }

        if (tokenType) {
          localStorage.setItem(
            "arxzen_token_type",
            tokenType
          );
        }

        window.history.replaceState(
          {},
          document.title,
          "/oauth/callback"
        );

        navigate("/home", {
          replace: true,
          state: {
            oauth: true
          }
        });
      } catch (err) {
        console.error(
          "OAuth callback error:",
          err
        );

        setError(
          err?.message ||
            "ARX-OAUTH-003: Unable to complete authentication."
        );
      }
    }

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#0b0d12] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            !
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Authentication failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login", {
                replace: true
              })
            }
            className="mt-6 h-11 w-full rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Return to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090d] text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

        <p className="mt-5 text-sm text-zinc-500">
          Completing authentication...
        </p>
      </div>
    </main>
  );
}
