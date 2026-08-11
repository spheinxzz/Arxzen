import { useAuthContext } from "../../context/AuthContext";

export default function AuthButton() {
  const { user, logout } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <button type="button" onClick={logout}>
      Log out
    </button>
  );
}
