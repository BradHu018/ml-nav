import { useEffect, useState } from "react";
import BuildCard from "./BuildCard";
import { track } from "@vercel/analytics";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/builds`;
const FAVORITES_API_URL = `${API_BASE}/api/favorites`;

const starterBuilds = [
  {
    id: "starter-1",
    user_id: null,
    username: "ProGamer99",
    hero_name: "Fanny",
    build_name: "Cable Queen Assassin",
    description: "High burst mobility build for snowballing with Fanny.",
    emblem: "Assassin",
    battle_spell: "Retribution",
    is_public: true,
    upvotes: 2847,
    downvotes: 0,
    build_items: [
      "Blade of Despair",
      "Hunter Strike",
      "Endless Battle",
      "War Axe",
      "Malefic Gun",
      "Immortality",
    ],
  },
  {
    id: "starter-2",
    user_id: null,
    username: "MageMaster",
    hero_name: "Gusion",
    build_name: "One-Shot Mage Build",
    description: "Burst magic build for quickly deleting squishy enemies.",
    emblem: "Mage",
    battle_spell: "Execute",
    is_public: true,
    upvotes: 2634,
    downvotes: 0,
    build_items: [
      "Genius Wand",
      "Divine Glaive",
      "Holy Crystal",
      "Blood Wings",
      "Concentrated Energy",
      "Winter Crown",
    ],
  },
  {
    id: "starter-3",
    user_id: null,
    username: "SkyWalker",
    hero_name: "Ling",
    build_name: "Fast Split Push Assassin",
    description: "High mobility assassin build focused on split pushing.",
    emblem: "Assassin",
    battle_spell: "Retribution",
    is_public: true,
    upvotes: 1982,
    downvotes: 0,
    build_items: [
      "Berserker's Fury",
      "Endless Battle",
      "Blade of Despair",
      "Malefic Gun",
      "Windtalker",
      "Immortality",
    ],
  },
  {
    id: "starter-4",
    user_id: null,
    username: "DaggerMaster",
    hero_name: "Gusion",
    build_name: "Burst Combo Build",
    description: "Combo-heavy Gusion build for fast pickoffs.",
    emblem: "Mage",
    battle_spell: "Execute",
    is_public: true,
    upvotes: 1401,
    downvotes: 0,
    build_items: [
      "Starlium Scythe",
      "Divine Glaive",
      "Blood Wings",
      "Genius Wand",
      "Holy Crystal",
      "Winter Crown",
    ],
  },
];

function CommunityBuilds() {
  const [backendBuilds, setBackendBuilds] = useState([]);
  const [search, setSearch] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
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
    track("View Community Builds Page");
    fetchTopBuilds();
  }, []);

  const allBuilds = [...backendBuilds, ...starterBuilds];

  const displayBuilds = allBuilds
    .filter((build) => {
      const searchText = search.trim().toLowerCase();

      if (searchText === "") {
        return true;
      }

      return build.hero_name.toLowerCase().includes(searchText);
    })
    .sort((a, b) => Number(b.upvotes) - Number(a.upvotes))
    .slice(0, search.trim() === "" ? 10 : 5);

  async function fetchTopBuilds() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/top?limit=10`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load community builds");
      }

      setBackendBuilds(data.builds || []);
    } catch (err) {
      setError(err.message);
      setBackendBuilds([]);
    } finally {
      setLoading(false);
    }
  }

  async function searchBackendBuilds(heroName) {
    const trimmedHero = heroName.trim();

    if (trimmedHero === "") {
      fetchTopBuilds();
      return;
    }

    track ("Search Community Builds", {
      hero: trimmedHero,
    })

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/search?hero=${encodeURIComponent(trimmedHero)}&limit=10`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not search builds");
      }

      setBackendBuilds(data.builds || []);
    } catch (err) {
      setError(err.message);
      setBackendBuilds([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchChange(e) {
    const value = e.target.value;

    setSearch(value);
    searchBackendBuilds(value);
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleUpvote(buildId) {

    if (String(buildId).startsWith("starter-")) {
        setError("Starter builds are demo builds and cannot be upvoted.");
        return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
        setError("you need to log in before upvoting a build.");
        return;
    }

    setError("");
    setMessage("");

    try {
        const response = await fetch(`${API_URL}/${buildId}/upvote`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not upvote build");
        }

        setBackendBuilds((prev) =>
            prev.map((build) =>
                build.id === buildId
                ? {
                    ...build,
                    upvotes: data.upvotes,
                    }
                : build
            )
        );
    } catch (err) {
        setError(err.message);
    }

  }

  async function handleSaveBuild(buildId) {
     if (String(buildId).startsWith("starter-")) {
        setError("Starter builds are demo builds and cannot be saved.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to log in before saving a build.");
        return;
      }

      setError("");
      setMessage("");

      try {
        const response = await fetch(`${FAVORITES_API_URL}/${buildId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not save build");
        }

        setMessage("Build saved successfully.");
      } catch (err) {
        setError(err.message);
      }
  }

  async function handleSubmit(e) {
    e.preventDefault();


    console.log("handleSubmit fired");
    console.log("formData:", formData);

    const token = localStorage.getItem("token");

    console.log("token:", token);
    if (!token) {
      setError("You need to log in before uploading a build.");
      return;
    }

    const build_items = [
      formData.item1,
      formData.item2,
      formData.item3,
      formData.item4,
      formData.item5,
      formData.item6,
    ];

    const newBuild = {
      hero_name: formData.hero_name,
      build_name: formData.build_name,
      description: formData.description,
      emblem: formData.emblem,
      battle_spell: formData.battle_spell,
      is_public: formData.is_public,
      build_items,
    };

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBuild),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not upload build");
      }

      setMessage(
        formData.is_public
          ? "Build uploaded publicly."
          : "Build saved privately."
      );

      setFormData({
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

      setShowUploadForm(false);

      if (newBuild.is_public) {
        fetchTopBuilds();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="upload-build-btn"
        onClick={() => {
          track("Open Build Upload Form");
          setShowUploadForm(true)
        }}
      >
        <span>+</span>
        Upload Your Build
      </button>

      <div className="search-box">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for a hero..."
        />
      </div>

      {search.trim() !== "" && (
        <button
          className="back-builds-btn"
          onClick={() => {
            track("Back to Top Builds");
            setSearch("");
            fetchTopBuilds();
          }}
        >
          ← Back to top builds
        </button>
      )}

      {message && <p className="build-success-message">{message}</p>}
      {error && <p className="build-error-message">{error}</p>}

      <h2 className="builds-title">
        {search.trim() === ""
          ? "Top 10 Builds Across All Heroes"
          : `Top Builds for "${search}"`}
      </h2>

      <div className="build-list">
        {loading ? (
          <div className="empty-builds">Loading builds...</div>
        ) : displayBuilds.length > 0 ? (
          displayBuilds.map((build, index) => (
            <BuildCard
                key={build.id}
                build={build}
                rank={search.trim() === "" ? index + 1 : null}
                onUpvote={handleUpvote}
                onSave = {handleSaveBuild}
            />
          ))
        ) : (
          <div className="empty-builds">
            No public builds available for that hero. You can upload your own
            public build or check the platform recommended builds.
          </div>
        )}
      </div>

      {showUploadForm && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="upload-modal-header">
              <h2>Upload Your Build</h2>

              <button
                className="close-modal-btn"
                onClick={() => {
                  track("Close Build Upload Form");
                  setShowUploadForm(false)
                }}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="upload-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hero Name *</label>
                <input
                  name="hero_name"
                  value={formData.hero_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Fanny, Gusion, Ling"
                  required
                />
              </div>

              <div className="form-group">
                <label>Build Name *</label>
                <input
                  name="build_name"
                  value={formData.build_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Cable Queen Assassin"
                  required
                />
              </div>

              <div className="form-group">
                <label>Build Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your build strategy, playstyle, and when to use it..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emblem *</label>
                  <input
                    name="emblem"
                    value={formData.emblem}
                    onChange={handleInputChange}
                    placeholder="e.g., Assassin"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Battle Spell *</label>
                  <input
                    name="battle_spell"
                    value={formData.battle_spell}
                    onChange={handleInputChange}
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
                    checked={formData.is_public}
                    onChange={handleInputChange}
                  />
                  Make this build public
                </label>

                <p>
                  Public builds appear on the Community Builds page. Private
                  builds are saved only to your account.
                </p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Item 1 *</label>
                  <input
                    name="item1"
                    value={formData.item1}
                    onChange={handleInputChange}
                    placeholder="First item"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item 2 *</label>
                  <input
                    name="item2"
                    value={formData.item2}
                    onChange={handleInputChange}
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
                    value={formData.item3}
                    onChange={handleInputChange}
                    placeholder="Third item"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item 4 *</label>
                  <input
                    name="item4"
                    value={formData.item4}
                    onChange={handleInputChange}
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
                    value={formData.item5}
                    onChange={handleInputChange}
                    placeholder="Fifth item"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item 6 *</label>
                  <input
                    name="item6"
                    value={formData.item6}
                    onChange={handleInputChange}
                    placeholder="Sixth item"
                    required
                  />
                </div>
              </div>

              <button className="submit-build-btn" type="submit">
                {loading ? "Submitting..." : "Submit Build"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityBuilds;