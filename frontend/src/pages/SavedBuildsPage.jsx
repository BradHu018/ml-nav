import SavedBuilds from "../components/SavedBuilds";
import "../App.css";

function SavedBuildsPage() {
  return (
    <main className="saved-builds-page">
      <div className="saved-builds-container">
        <header className="saved-builds-header">
          <p className="section-kicker">Saved Builds</p>
          <h1>Your Favorite Community Builds</h1>
          <p>
            Builds you save from the community page will appear here so you can
            quickly revisit them later.
          </p>
        </header>

        <SavedBuilds />
      </div>
    </main>
  );
}

export default SavedBuildsPage;