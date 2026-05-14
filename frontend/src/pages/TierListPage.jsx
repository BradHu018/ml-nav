import { useEffect, useState } from "react";

const tiers = ["S", "A", "B", "C"];

const tierDescriptions = {
  S: {
    title: "Must-Pick / Must-Ban",
    description:
      "Dominant heroes with extreme ban pressure, very high win rate, or top overall score.",
  },
  A: {
    title: "Strong Meta Picks",
    description:
      "Reliable heroes with strong pick rate, stable win rate, or meaningful ban pressure.",
  },
  B: {
    title: "Situational / Good",
    description:
      "Playable heroes that can work well in specific drafts, team comps, or counter-pick situations.",
  },
  C: {
    title: "Weak / Outclassed",
    description:
      "Heroes with low win rate, low meta presence, or stronger alternatives in the same role.",
  },
};

function TierListPage() {
  const [heroes, setHeroes] = useState([]);
  const [message, setMessage] = useState("");

  async function fetchTierList() {
    try {

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/tier-list`);
      const data = await response.json();

      if (response.ok) {
        setHeroes(data.heroes);
      } else {
        setMessage(data.message || "Failed to load tier list");
      }
    } catch {
      setMessage("Could not reach server");
    }
  }

  useEffect(() => {
    fetchTierList();
  }, []);

  function getHeroesByTier(tier) {
    return heroes.filter((hero) => hero.tier === tier);
  }

  return (
    <section className="tier-page">
      <div className="tier-hero-bg tier-blob-one"></div>
      <div className="tier-hero-bg tier-blob-two"></div>

      <div className="tier-header">
        <p className="tier-kicker">ML Navigator Rankings</p>
        <h1>Hero Tier List</h1>
        <p>
          Heroes are grouped using 2026 tier logic based on win rate, pick rate,
          and ban rate from the live hero stats API.
        </p>
      </div>

      <div className="tier-formula-card">
        <h2>2026 Tier Rules</h2>
        <p>
          S-Tier heroes are must-pick or must-ban threats. A-Tier heroes are
          strong meta picks. B-Tier heroes are situational but playable. C-Tier
          heroes are weaker or outclassed by stronger options.
        </p>
      </div>

      {message && <p className="tier-message">{message}</p>}

      <div className="tier-list">
        {tiers.map((tier) => (
          <div className={`tier-row tier-${tier.toLowerCase()}`} key={tier}>
            <div className="tier-rank">
              <span>{tier}</span>
            </div>

            <div className="tier-row-body">
              <div className="tier-row-info">
                <h2>{tierDescriptions[tier].title}</h2>
                <p>{tierDescriptions[tier].description}</p>
              </div>

              <div className="tier-content tier-icon-grid">
                {getHeroesByTier(tier).length === 0 ? (
                  <p className="tier-empty">No heroes in this tier.</p>
                ) : (
                  getHeroesByTier(tier).map((hero) => (
                    <article className="tier-icon-card" key={hero.hero_name}>
                      <img
                        src={hero.image}
                        alt={hero.hero_name}
                        className="tier-icon-img"
                      />
                      <p>{hero.hero_name}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TierListPage;