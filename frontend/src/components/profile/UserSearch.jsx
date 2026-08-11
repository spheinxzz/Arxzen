const PROFILE_KEY = "arxen_profiles";

function getProfiles() {
  const raw = localStorage.getItem(PROFILE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}

export function getProfile(userId) {
  if (!userId) {
    return null;
  }

  const profiles = getProfiles();
  return profiles[userId] || null;
}

export function createProfile(userId, profile = {}) {
  if (!userId) {
    throw new Error("ARX-001: User ID is required.");
  }

  const profiles = getProfiles();

  const newProfile = {
    userId,
    username: profile.username || "Username",
    displayName: profile.displayName || "Username",
    bio: profile.bio || "",
    avatar: profile.avatar || "",
  };

  profiles[userId] = newProfile;
  saveProfiles(profiles);

  return newProfile;
}

export function updateProfile(userId, updates = {}) {
  if (!userId) {
    throw new Error("ARX-001: User ID is required.");
  }

  const profiles = getProfiles();

  const current =
    profiles[userId] ||
    createProfile(userId);

  const updated = {
    ...current,
    ...updates,
    userId,
  };

  profiles[userId] = updated;
  saveProfiles(profiles);

  return updated;
}

export function deleteProfile(userId) {
  if (!userId) {
    return false;
  }

  const profiles = getProfiles();

  if (!profiles[userId]) {
    return false;
  }

  delete profiles[userId];
  saveProfiles(profiles);

  return true;
}