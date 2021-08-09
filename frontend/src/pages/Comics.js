import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";

function Comics() {
  const { did } = useParams();
  const { idx } = useProfile();

  return (
    <div>
      <ActionsContainer>
        {idx && did === idx.id && (
          <Link className="btn btn-info ml-2" to="/comic/new">
            Add new comic
          </Link>
        )}
      </ActionsContainer>
      <PageContainer></PageContainer>
    </div>
  );
}

export default Comics;
