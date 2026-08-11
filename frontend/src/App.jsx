import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AccountSetup from "./pages/AccountSetup";
import OAuthCallback from "./pages/OAuthCallback";

import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import People from "./pages/People";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/oauth/callback"
          element={<OAuthCallback />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/account-setup"
          element={<AccountSetup />}
        />

        {/* Protected */}

        <Route
          element={<ProtectedRoute />}
        >
          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/messages"
            element={<Messages />}
          />

          <Route
            path="/messages/:conversationId"
            element={<Messages />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/people"
            element={<People />}
          />

          <Route
            path="/profile/:id?"
            element={<Profile />}
          />

          <Route
            path="/security"
            element={<Security />}
          />

          <Route
            path="/settings/security"
            element={<Security />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        {/* Legacy app route */}

        <Route
          path="/app"
          element={
            <Navigate
              to="/home"
              replace
            />
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}
