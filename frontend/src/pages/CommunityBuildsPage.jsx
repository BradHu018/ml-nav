import CommunityBuilds from "../components/CommunityBuilds";
import "../App.css";

function CommunityBuildsPage() {
  return (
    <main className="community-page">
      <div className="community-container">
        <header className="community-header">
          <h1>ML Community Builds</h1>
          <p>Top builds from the community</p>
        </header>

        <CommunityBuilds />
      </div>
    </main>
  );
}

export default CommunityBuildsPage;