import MyBuilds from "../components/MyBuilds";
import "../App.css";

function MyBuildsPage() {
  return (
    <main className="my-builds-page">
      <div className="my-builds-container">
        <header className="my-builds-header">
          <p className="section-kicker">My Builds</p>
          <h1>Your Saved Hero Builds</h1>
          <p>
            View your public and private builds, manage visibility, edit build
            details, or delete builds you no longer want.
          </p>
        </header>

        <MyBuilds />
      </div>
    </main>
  );
}

export default MyBuildsPage;