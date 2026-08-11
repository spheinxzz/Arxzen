import AuthButton from "./AuthButton";

function AuthProviderButtons({
  onGoogle,
  onDiscord
}) {
  return (
    <div className="space-y-3">
      <AuthButton
        provider="google"
        onClick={onGoogle}
      />

      <AuthButton
        provider="discord"
        onClick={onDiscord}
      />
    </div>
  );
}

export default AuthProviderButtons;