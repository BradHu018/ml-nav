import { useEffect, useState } from "react";
import BuildCard from "./BuildCard";
import { track } from "@vercel/analytics";

const API_URL = `${import.meta.env.VITE_API_URL}/api/builds`;

function MyBuilds() {
  const [builds, setBuilds] = useState([]);
  const [editingBuild, setEditingBuild] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editFormData, setEditFormData] = useState({
    hero_name: "",
    build_name: "",
    description: "",
    emblem: "",
    battle_spell: "",
    is_public: true,
    item1: "",
    item2: "",
    item3: "",
    item4: "",
    item5: "",
    item6: "",
  });

  useEffect(() => {
    fetchMyBuilds();
  }, []);

  async function fetchMyBuilds() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to log in to view your builds.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/my-builds`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load your builds");
      }

      setBuilds(data.builds || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(build) {

    track("Open Edit Build Modal", {
      buildId: build.id,
      hero: build.hero_name,
      buildName: build.build_name,
      isPublic: Boolean(build.is_public),
    });
    setEditingBuild(build);
    setError("");
    setMessage("");

    setEditFormData({
      hero_name: build.hero_name || "",
      build_name: build.build_name || "",
      description: build.description || "",
      emblem: build.emblem || "",
      battle_spell: build.battle_spell || "",
      is_public: Boolean(build.is_public),
      item1: build.build_items?.[0] || "",
      item2: build.build_items?.[1] || "",
      item3: build.build_items?.[2] || "",
      item4: build.build_items?.[3] || "",
      item5: build.build_items?.[4] || "",
      item6: build.build_items?.[5] || "",
    });
  }

  function closeEditModal() {

    track("Close Edit Build Modal");

    setEditingBuild(null);

    setEditFormData({
      hero_name: "",
      build_name: "",
      description: "",
      emblem: "",
      battle_spell: "",
      is_public: true,
      item1: "",
      item2: "",
      item3: "",
      item4: "",
      item5: "",
      item6: "",
    });
  }

  function handleEditInputChange(e) {
    const { name, value, type, checked } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    if (!editingBuild) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {

      track("Update Build Blocked", {
        reason: "not_logged_in",
        buildId: editingBuild.id,
      });
      setError("You need to log in before editing a build.");
      return;
    }

    const build_items = [
      editFormData.item1,
      editFormData.item2,
      editFormData.item3,
      editFormData.item4,
      editFormData.item5,
      editFormData.item6,
    ];

    const updatedBuild = {
      hero_name: editFormData.hero_name,
      build_name: editFormData.build_name,
      description: editFormData.description,
      emblem: editFormData.emblem,
      battle_spell: editFormData.battle_spell,
      is_public: editFormData.is_public,
      build_items,
    };

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${editingBuild.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBuild),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update build");
      }

      setMessage("Build updated successfully.");

      track("Update Build Success", {
        buildId: editingBuild.id,
        oldHero: editingBuild.hero_name,
        newHero: updatedBuild.hero_name,
        buildName: updatedBuild.build_name,
        isPublic: updatedBuild.is_public,
      });
      closeEditModal();
      fetchMyBuilds();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(buildId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this build? This cannot be undone."
    );

    if (!confirmed) {

      track("Delete Build Cancelled", {
        buildId,
      });
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to log in before deleting a build.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${buildId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete build");
      }

      setBuilds((prev) => prev.filter((build) => build.id !== buildId));
      setMessage("Build deleted successfully.");

      track("Delete Build Success", {
        buildId,
        hero: deletedBuild?.hero_name || "unknown",
        buildName: deletedBuild?.build_name || "unknown",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="my-builds-section">
      <div className="my-builds-actions">
        <button 
          className="refresh-builds-btn" 
          onClick={() => {

            track("Refresh My Builds");
            fetchMyBuilds();
          }}
        >
        </button>
      </div>

      {message && <p className="build-success-message">{message}</p>}
      {error && <p className="build-error-message">{error}</p>}

      {loading && !editingBuild ? (
        <div className="empty-builds">Loading your builds...</div>
      ) : builds.length > 0 ? (
        <div className="my-builds-list">
          {builds.map((build) => (
            <div className="my-build-wrapper" key={build.id}>
              <BuildCard build={build} rank={null} />

              <div className="my-build-card-actions">
                <button
                  className="edit-build-btn"
                  type="button"
                  onClick={() => openEditModal(build)}
                >
                  Edit
                </button>

                <button
                  className="delete-build-btn"
                  type="button"
                  onClick={() => handleDelete(build.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-builds">
          You have not created any builds yet. Create one from the Community
          Builds page.
        </div>
      )}

      {editingBuild && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="upload-modal-header">
              <h2>Edit Build</h2>

              <button
                className="close-modal-btn"
                type="button"
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>

            <form className="upload-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Hero Name *</label>
                <input
                  name="hero_name"
                  value={editFormData.hero_name}
                  onChange={handleEditInputChange}
                  placeholder="e.g., Fanny, Gusion, Ling"
                  required
                />
              </div>

              <div className="form-group">
                <label>Build Name *</label>
                <input
                  name="build_name"
                  value={editFormData.build_name}
                  onChange={handleEditInputChange}
                  placeholder="e.g., Cable Queen Assassin"
                  required
                />
              </div>

              <div className="form-group">
                <label>Build Description *</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Describe your build strategy..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emblem *</label>
                  <input
                    name="emblem"
                    value={editFormData.emblem}
                    onChange={handleEditInputChange}
                    placeholder="e.g., Assassin"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Battle Spell *</label>
                  <input
                    name="battle_spell"
                    value={editFormData.battle_spell}
                    onChange={handleEditInputChange}
                    placeholder="e.g., Retribution"
                    required
                  />
                </div>
              </div>

              <div className="visibility-box">
                <label className="visibility-label">
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={editFormData.is_public}
                    onChange={handleEditInputChange}
                  />
                  Make this build public
                </label>

                <p>
                  Public builds appear on the Community Builds page. Private
                  builds stay only in My Builds.
                </p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Item 1 *</label>
                  <input
                    name="item1"
                    value={editFormData.item1}
                    onChange={handleEditInputChange}
                    placeholder="First item"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item 2 *</label>
                  <input
                    name="item2"
                    value={editFormData.item2}
                    onChange={handleEditInputChange}
                    placeholder="Second item"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Item 3 *</label>
                  <input
                    name="item3"
                    value={editFormData.item3}
                    onChange={handleEditInputChange}
                    placeholder="Third item"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item 4 *</label>
                  <input
                    name="item4"
                    value={editFormData.item4}
                    onChange={handleEditInputChange}
                    placeholder="Fourth item"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Item 5 *</label>
                  <input
                    name="item5"
                    value={editFormData.item5}
                    onChange={handleEditInputChange}
                    placeholder="Fifth item"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item 6 *</label>
                  <input
                    name="item6"
                    value={editFormData.item6}
                    onChange={handleEditInputChange}
                    placeholder="Sixth item"
                    required
                  />
                </div>
              </div>

              <button className="submit-build-btn" type="submit">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyBuilds;