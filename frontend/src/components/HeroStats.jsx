import { useEffect, useState } from "react";

function parseRate(rate) {
  return parseFloat(String(rate).replace("%", "")) || 0;
}

export default function HeroStats() {
  const [heroes, setHeroes] = useState([]);
  const [sortState, setSortState] = useState({
    key: "winrate",
    direction: "desc",
  });

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Pren7/MLBB-Winrate/refs/heads/main/winrate.json")
      .then(res => res.json())
      .then(data => setHeroes(data))
      .catch(() => console.error("Failed to load hero data"));
  }, []);

  function handleSort(key) {
    const direction =
      sortState.key === key && sortState.direction === "desc"
        ? "asc"
        : "desc";

    const sortedHeroes = [...heroes].sort((a, b) => {
      const aVal = parseRate(a[key]);
      const bVal = parseRate(b[key]);

      return direction === "asc" ? aVal - bVal : bVal - aVal;
    });

    setHeroes(sortedHeroes);
    setSortState({ key, direction });
  }

  return (
    <div className="table-container">
      <h2>Hero Statistics</h2>
    
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th onClick={() => handleSort("winrate")}>Winrate</th>
            <th onClick={() => handleSort("banrate")}>Banrate</th>
            <th onClick={() => handleSort("pickrate")}>Pickrate</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map(hero => (
            <tr key={hero.name}>
              <td>
                <img src={hero.icon} alt={hero.name} width="40" />
              </td>
              <td>{hero.name}</td>
              <td>{hero.winrate}</td>
              <td>{hero.banrate}</td>
              <td>{hero.pickrate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}