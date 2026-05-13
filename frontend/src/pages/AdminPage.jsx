import { useEffect, useState } from "react";

function AdminPage({ handleLogout }) {
  const [builds, setBuilds] = useState([]);
  const [message, setMessage] = useState("");

  async function fetchBuilds() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/admin/builds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBuilds(data.builds);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Could not reach server");
    }
  }

  async function deleteBuild(buildId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/builds/${buildId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Build deleted");
        fetchBuilds();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Could not reach server");
    }
  }

  useEffect(() => {
    fetchBuilds();
  }, []);

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Channel</h1>
          <p>Manage community builds submitted by users.</p>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <section className="admin-build-list">
        {builds.length === 0 ? (
          <p className="admin-empty-message">No community builds found.</p>
        ) : (
          builds.map((build) => (
            <div className="admin-build-card" key={build.id}>
              <h2>{build.build_name}</h2>

              <p>
                <strong>Hero:</strong> {build.hero_name}
              </p>

              <p>
                <strong>Created by:</strong> {build.username}
              </p>

              <p>
                <strong>Emblem:</strong> {build.emblem}
              </p>

              <p>
                <strong>Battle Spell:</strong> {build.battle_spell}
              </p>

              <p>{build.description}</p>

              <button
                className="admin-delete-btn"
                onClick={() => deleteBuild(build.id)}
              >
                Delete Build
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default AdminPage;