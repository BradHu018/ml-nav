import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function UploadBuild({ onBuildCreated }) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    hero_name: "",
    build_name: "",
    username: "",
    description: "",
    emblem: "",
    battle_spell: "",
    is_public: true,
  });

  const [buildItems, setBuildItems] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleItemChange(index, value) {
    const updatedItems = [...buildItems];
    updatedItems[index] = value;
    setBuildItems(updatedItems);
  }

  function resetForm() {
    setFormData({
      hero_name: "",
      build_name: "",
      username: "",
      description: "",
      emblem: "",
      battle_spell: "",
      is_public: true,
    });

    setBuildItems(["", "", "", "", "", ""]);
    setMessage("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanedItems = buildItems.map((item) => item.trim());

    if (cleanedItems.some((item) => item === "")) {
      setError("Please enter all 6 build items.");
      return;
    }

    const token = localStorage.getItem("token");

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/builds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          hero_name: formData.hero_name,
          build_name: formData.build_name,
          username: formData.username,
          description: formData.description,
          emblem: formData.emblem,
          battle_spell: formData.battle_spell,
          build_items: cleanedItems,
          is_public: formData.is_public,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to upload build.");
        return;
      }

      setMessage(
        formData.is_public
          ? "Build uploaded to community builds!"
          : "Build saved privately."
      );

      resetForm();

      if (onBuildCreated) {
        onBuildCreated();
      }
    } catch {
      setError("Could not reach server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeModal() {
    setIsOpen(false);
    setMessage("");
    setError("");
  }

  return (
    <>
      <button className="primary-btn" onClick={() => setIsOpen(true)}>
        Upload Build
      </button>

      {isOpen && (
        <div className="modal-backdrop">
          <div className="build-modal">
            <div className="build-modal-header">
              <h2>Upload Your Build</h2>

              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="build-form" onSubmit={handleSubmit}>
              <label>
                Hero Name *
                <input
                  type="text"
                  name="hero_name"
                  placeholder="e.g., Fanny, Gusion, Ling"
                  value={formData.hero_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Build Name *
                <input
                  type="text"
                  name="build_name"
                  placeholder="e.g., Cable Queen Assassin"
                  value={formData.build_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Your Username *
                <input
                  type="text"
                  name="username"
                  placeholder="e.g., ProGamer99"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Build Description *
                <textarea
                  name="description"
                  placeholder="Describe your build strategy, playstyle, and when to use it..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="two-column-form">
                <label>
                  Emblem *
                  <input
                    type="text"
                    name="emblem"
                    placeholder="e.g., Assassin"
                    value={formData.emblem}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Battle Spell *
                  <input
                    type="text"
                    name="battle_spell"
                    placeholder="e.g., Retribution"
                    value={formData.battle_spell}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="items-form-block">
                <h3>Build Items *</h3>
                <p>Add exactly 6 items in order.</p>

                <div className="item-input-grid">
                  {buildItems.map((item, index) => (
                    <label key={index}>
                      Item {index + 1}
                      <input
                        type="text"
                        placeholder={`Item ${index + 1}`}
                        value={item}
                        onChange={(e) =>
                          handleItemChange(index, e.target.value)
                        }
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>

              <label className="share-checkbox">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                />

                <span>
                  Add this build to public hero build search and community top
                  builds.
                </span>
              </label>

              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {isSubmitting ? "Submitting..." : "Submit Build"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadBuild;