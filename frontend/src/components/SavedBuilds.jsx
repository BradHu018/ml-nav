import { useEffect, useState } from "react";
import BuildCard from "./BuildCard";

const FAVORITES_API_URL = `${import.meta.env.VITE_API_URL}/api/favorites`;

function SavedBuilds() {
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSavedBuilds();
  }, []);

  async function fetchSavedBuilds() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to log in to view saved builds.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(FAVORITES_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load saved builds");
      }

      setSavedBuilds(data.builds || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsave(buildId) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to log in before removing a saved build.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${FAVORITES_API_URL}/${buildId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not remove saved build");
      }

      setSavedBuilds((prev) => prev.filter((build) => build.id !== buildId));
      setMessage("Build removed from saved builds.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="saved-builds-section">
      <div className="saved-builds-actions">
        <button className="refresh-builds-btn" onClick={fetchSavedBuilds}>
          Refresh Saved Builds
        </button>
      </div>

      {message && <p className="build-success-message">{message}</p>}
      {error && <p className="build-error-message">{error}</p>}

      {loading ? (
        <div className="empty-builds">Loading saved builds...</div>
      ) : savedBuilds.length > 0 ? (
        <div className="saved-builds-list">
          {savedBuilds.map((build) => (
            <div className="saved-build-wrapper" key={build.id}>
              <BuildCard build={build} rank={null} />

              <div className="saved-build-card-actions">
                <button
                  className="unsave-build-btn"
                  type="button"
                  onClick={() => handleUnsave(build.id)}
                >
                  Remove Saved Build
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-builds">
          You have not saved any community builds yet.
        </div>
      )}
    </section>
  );
}

export default SavedBuilds;