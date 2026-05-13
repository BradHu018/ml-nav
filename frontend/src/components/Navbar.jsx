import { useState } from "react";

function Navbar({ setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function goToPage(pageName) {
    setPage(pageName);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="title">mlnav</div>

      <button
        className="hamburger-btn"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <ul className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
        <li>
          <button onClick={() => goToPage("home")}>Home</button>
        </li>

        <li>
          <button onClick={() => goToPage("heroes")}>Heroes</button>
        </li>

        <li>
          <button onClick={() => goToPage("emblems")}>Emblems</button>
        </li>

        <li>
          <button onClick={() => goToPage("builds")}>
            Recommended Builds
          </button>
        </li>

        <li>
          <button onClick={() => goToPage("community_builds")}>
            Community Builds
          </button>
        </li>

        <li>
          <button onClick={() => goToPage("my_builds")}>My Builds</button>
        </li>

        <li>
          <button onClick={() => goToPage("saved_builds")}>Saved Builds</button>
        </li>
        <li>
          <button onClick={() => goToPage("tips")}>Tips</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;