function Navbar({ setPage }) {
  return (
    <nav>
      <div className="title">mlnav</div>

      <ul className="nav-links">
        <li>
          <button onClick={() => setPage("home")}>Home</button>
        </li>

        <li>
          <button onClick={() => setPage("heroes")}>Heroes</button>
        </li>

        <li>
          <button onClick={() => setPage("emblems")}>Emblems</button>
        </li>

        <li>
          <button onClick={() => setPage("builds")}>
            Recommended Builds
          </button>
        </li>

        <li>
          <button onClick={() => setPage("community_builds")}>
            Community Builds
          </button>
        </li>

        <li>
          <button onClick={() => setPage("tips")}>Tips</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;