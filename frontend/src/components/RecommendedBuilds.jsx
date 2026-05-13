import { useState } from "react";
import heroBuilds from "../data/equipment.json";

export default function RecommendedBuilds() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleSearch() {
    const name = input.trim().toLowerCase();

    if (!name) {
      setError("Please enter a hero name.");
      setResult(null);
      return;
    }

    const hero = heroBuilds.find(
      h => h.name.toLowerCase() === name
    );

    if (!hero) {
      setError(`No build found for ${input}`);
      setResult(null);
      return;
    }

    setError("");
    setResult(hero);
  }

  return (
    <div>
      <h2>Recommended Builds</h2>

      <input
        type="text"
        placeholder="Enter hero name..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>{result.name}</h3>
          <div>
            {result.bestBuild.map((item, i) => (
              <img
                key={i}
                src={`/items/${item}`}
                alt="item"
                style={{ width: 64, margin: 5 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}