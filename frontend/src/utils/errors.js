export function validateUsername(username) {
  const value = username.trim();

  if (!value) {
    return "Username is required.";
  }

  if (value.length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (value.length > 32) {
    return "Username cannot exceed 32 characters.";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return "Username can only contain letters, numbers, and underscores.";
  }

  return null;
}

export function validateDisplayName(displayName) {
  const value = displayName.trim();

  if (!value) {
    return "Display name is required.";
  }

  if (value.length > 50) {
    return "Display name cannot exceed 50 characters.";
  }

  return null;
}

export function validateEmail(email) {
  const value = email.trim();

  if (!value) {
    return "Email is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}