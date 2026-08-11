import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../services/authService";

export default function OAuthCallback() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function completeOAuth() {
      try {
        const hash = window.location.hash;

        if (!hash) {
          throw new Error(
            "ARX-OAUTH-001: OAuth session data is missing."
          );
        }

        const params = new URLSearchParams(hash.substring(1));

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const expiresIn = params.get("expires_in");
        const tokenType = params.get("token_type");
        const oauthError = params.get("error");
        const oauthErrorDescription = params.get(
          "error_description"
        );

        if (oauthError) {
          throw new Error(
            `ARX-OAUTH-002: ${
              oauthErrorDescription || oauthError
            }`
          );
        }

        if (!accessToken) {
          throw new Error(
            "ARX-OAUTH-003: Access token is missing."
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

        const session = await getSession();

        if (!session?.user) {
          localStorage.removeItem(
            "arxzen_access_token"
          );

          localStorage.removeItem(
            "arxzen_refresh_token"
          );

          throw new Error(
            "ARX-OAUTH-004: The authenticated account could not be verified."
          );
        }

        if (!mounted) {
          return;
        }

        setProcessing(false);

        navigate("/home", {
          replace: true,
          state: {
            oauth: true,
            user: session.user
          }
        });
      } catch (err) {
        console.error("OAuth callback error:", err);

        if (!mounted) {
          return;
        }

        localStorage.removeItem(
          "arxzen_access_token"
        );

        localStorage.removeItem(
          "arxzen_refresh_token"
        );

        setError(
          err?.message ||
            "ARX-OAUTH-005: Unable to complete authentication."
        );

        setProcessing(false);
      }
    }

    completeOAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (processing && !error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-5 text-white">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-400" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Completing authentication
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Verifying your Arxzen account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#0b0d12] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/[0.08] text-red-400">
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
