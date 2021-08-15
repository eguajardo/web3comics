import { useProfile } from "../hooks/useProfile";

import PageContainer from "../components/Layout/PageContainer";
import LoginCheck from "../components/UI/LoginCheck";

function Cleanup() {
  const { idx, resetProfile } = useProfile();

  console.log("cleanup idx", idx);
  console.log("cleanup idx.id", idx?.id);

  const cleanIdx = async () => {
    console.log("profile before cleanup", await idx.get("basicProfile"));
    console.log("comics before cleanup", await idx.get("comics"));

    await idx.remove("basicProfile");
    console.log("cleaned up profile");
    await idx.remove("comics");
    console.log("cleaned up comics");
    resetProfile();

    console.log("profile after cleanup", await idx.get("basicProfile"));
    console.log("comics after cleanup", await idx.get("comics"));
  };

  return (
    <PageContainer>
      {idx && idx.id && (
        <button type="button" onClick={cleanIdx}>
          Clean IDX
        </button>
      )}
      <LoginCheck />
    </PageContainer>
  );
}

export default Cleanup;
