const TESTER_KEY = "arxen_tester_access";
const TESTER_ACCOUNTS_KEY = "arxen_tester_accounts";

const TESTER_PASSWORD =
  "6UfyjWhX9peeKuT-MEpi0bYH8pvikzAqNWqm59zW3L8yk6VrZiwy1A9p2U_4JRG2juT1h5ZJfv9c";

const MAX_TESTERS = 50;

function getAccounts() {
  const raw =
    localStorage.getItem(
      TESTER_ACCOUNTS_KEY
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(
    TESTER_ACCOUNTS_KEY,
    JSON.stringify(accounts)
  );
}

export function getTesterPassword() {
  return TESTER_PASSWORD;
}

export function verifyTesterPassword(
  password
) {
  return password === TESTER_PASSWORD;
}

export function hasTesterAccess() {
  return (
    localStorage.getItem(
      TESTER_KEY
    ) === "granted"
  );
}

export function grantTesterAccess() {
  localStorage.setItem(
    TESTER_KEY,
    "granted"
  );
}

export function revokeTesterAccess() {
  localStorage.removeItem(
    TESTER_KEY
  );
}

export function getTesterCount() {
  return getAccounts().length;
}

export function hasTesterCapacity() {
  return (
    getTesterCount() <
    MAX_TESTERS
  );
}

export function registerTester({
  email,
  password,
  username,
  displayName,
}) {
  if (!hasTesterCapacity()) {
    throw new Error(
      "ARX-TEST-005: The Arxzen Tester Program is currently full."
    );
  }

  if (!email?.trim()) {
    throw new Error(
      "ARX-TEST-001: Email is required."
    );
  }

  if (!password) {
    throw new Error(
      "ARX-TEST-002: Password is required."
    );
  }

  if (!username?.trim()) {
    throw new Error(
      "ARX-TEST-003: Username is required."
    );
  }

  if (!displayName?.trim()) {
    throw new Error(
      "ARX-TEST-004: Display name is required."
    );
  }

  const accounts =
    getAccounts();

  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedUsername =
    username.trim().toLowerCase();

  const existingEmail =
    accounts.find(
      (account) =>
        account.email ===
        normalizedEmail
    );

  if (existingEmail) {
    throw new Error(
      "ARX-TEST-006: An account with this email already exists."
    );
  }

  const existingUsername =
    accounts.find(
      (account) =>
        account.username ===
        normalizedUsername
    );

  if (existingUsername) {
    throw new Error(
      "ARX-TEST-007: That username is already taken."
    );
  }

  const account = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password,
    username:
      username.trim(),
    displayName:
      displayName.trim(),
    created_at:
      Date.now(),
  };

  accounts.push(account);

  saveAccounts(accounts);

  return account;
}

export function loginTester(
  email,
  password
) {
  const normalizedEmail =
    email?.trim().toLowerCase();

  const accounts =
    getAccounts();

  const account =
    accounts.find(
      (item) =>
        item.email ===
          normalizedEmail &&
        item.password ===
          password
    );

  if (!account) {
    throw new Error(
      "ARX-TEST-008: Email or password is incorrect."
    );
  }

  return account;
}