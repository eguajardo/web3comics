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

  const setProfile = async (updatedIdx, updatedProfile) => {
    if (!updatedIdx) {
      throw new Error("Missing IDX instance");
    }

    if (profile) {
      profile = { ...profile, ...updatedProfile };
    } else {
      profile = updatedProfile;
    }
    idx = updatedIdx;

    await idx.merge("basicProfile", profile);

    for (const listener of listeners) {
      listener[0](profile);
      listener[1](idx);
    }
  };

  const resetProfile = useCallback(() => {
    setState(null);
    setIdx(null);
  }, [setState, setIdx]);

  return { profile, setProfile, resetProfile, idx };
}
