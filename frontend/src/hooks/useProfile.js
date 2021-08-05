import { useCallback, useState } from "react";

let profile = {};

export function useProfile() {
  const setState = useState(profile)[1];

  const setProfile = useCallback(
    async (idx, value) => {
      if (!idx) {
        throw new Error("Missing IDX instance");
      }

      //if (!value || !value.did || !value.name || !value.image) {
      if (!value || !value.did || !value.name) {
        throw new Error(
          "Missing a required profile attribute (did, name and/or image)"
        );
      }

      profile = value;

      await idx.set("basicProfile", profile);
      setState(profile);
    },
    [setState]
  );

  const resetProfile = useCallback(() => {
    profile = {};
    setState(profile);
  }, [setState]);

  return { profile, setProfile, resetProfile };
}
