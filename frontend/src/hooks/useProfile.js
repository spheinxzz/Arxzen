import { useEffect, useState } from "react";
import {
  getProfile
} from "../services/profileService";

export default function useProfile(username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);

      const result =
        await getProfile(username);

      if (active) {
        setProfile(result);
        setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [username]);

  return {
    profile,
    loading
  };
}