function BuildCard({ build, rank }) {
  function getItemImage(itemName) {
    const fileName = itemName
      .replaceAll("'", "")
      .replaceAll(" ", "_");

    return `/items/${fileName}.webp`;
  }

  return (
    <div className="community-build-card">
      {rank && <div className="rank-badge">#{rank}</div>}

      <div className="hero-name">{build.hero_name}</div>

      <h3 className="build-name">{build.build_name}</h3>

      <div className="build-author">
        by <span>{build.username || `User #${build.user_id}`}</span>
      </div>

      <p className="build-description">{build.description}</p>

      <div className="build-details">
        <span>{build.emblem}</span>
        <span>{build.battle_spell}</span>
        <span>{build.is_public ? "Public" : "Private"}</span>
      </div>

      <div className="item-icons">
        {build.build_items.map((item, index) => (
          <div className="item-icon-box" key={`${item}-${index}`}>
            <img
              src={getItemImage(item)}
              alt={item}
              title={item}
              className="item-icon-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.textContent = item;
              }}
            />
          </div>
        ))}
      </div>

      <div className="vote-box">
        <span className="vote-arrow">↑</span>
        <span className="vote-count">
          {Number(build.upvotes).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default BuildCard;