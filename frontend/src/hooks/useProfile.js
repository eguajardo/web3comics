import { useCallback, useState, useEffect } from "react";

let profile = null;
let idx = null;
let listeners = [];

export function useProfile() {
  const setState = useState(profile)[1];
  const setIdx = useState(idx)[1];

  useEffect(() => {
    listeners.push([setState, setIdx]);

    return () => {
      listeners = listeners.filter((li) => li !== [setState, setIdx]);
    };
  }, [setState, setIdx]);

  const setProfile = useCallback(async (updatedIdx, updatedProfile) => {
    if (!updatedIdx) {
      throw new Error("Missing IDX instance");
    }

    if (profile) {
      profile = { ...profile, ...updatedProfile };
    } else {
      profile = updatedProfile;
    }
    idx = updatedIdx;
    console.log("profile before set", await idx.get("basicProfile"));
    console.log("profile to set", profile);

    await idx.merge("basicProfile", profile);

    for (const listener of listeners) {
      listener[0](profile);
      listener[1](idx);
    }
  }, []);

  const resetProfile = useCallback(() => {
    profile = null;
    idx = null;

    for (const listener of listeners) {
      listener[0](profile);
      listener[1](idx);
    }
  }, []);

  return { profile, setProfile, resetProfile, idx };
}
