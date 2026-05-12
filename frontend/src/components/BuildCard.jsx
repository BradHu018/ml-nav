function BuildCard({ build, rank, onUpvote }) {
  function getItemImage(itemName) {
    const fileName = itemName.replaceAll("'", "").replaceAll(" ", "_");
    return `/items/${fileName}.webp`;
  }

  function getEmblemImage(emblemName) {
    const fileName = emblemName.replaceAll("'", "").replaceAll(" ", "_");
    return `/emblems/${fileName}.png`;
  }

  function getSpellImage(spellName) {
    const fileName = spellName.replaceAll("'", "").replaceAll(" ", "_");
    return `/spells/${fileName}.webp`;
  }

  return (
    <div className="build-card-flip">
      <div className="build-card-inner">
        {/* Front side */}
        <div className="community-build-card build-card-front">
          {rank && <div className="rank-badge">#{rank}</div>}

          <div className="hero-name">{build.hero_name}</div>

          <h3 className="build-name">{build.build_name}</h3>

          <div className="build-author">
            by <span>{build.username || `User #${build.user_id}`}</span>
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

          <button
            className="vote-box"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote && onUpvote(build.id);
            }}
          >
            <span className="vote-arrow">↑</span>
            <span className="vote-count">
              {Number(build.upvotes).toLocaleString()}
            </span>
          </button>
        </div>

        {/* Back side */}
        <div className="community-build-card build-card-back">
          <h3 className="build-name">{build.build_name}</h3>

          <p className="build-description back-description">
            {build.description}
          </p>

          <div className="build-back-icons">
            <div className="build-back-icon-card">
              <img
                src={getEmblemImage(build.emblem)}
                alt={build.emblem}
                title={build.emblem}
                className="build-back-icon-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.querySelector(
                    ".build-back-icon-fallback"
                  ).style.display = "block";
                }}
              />

              <span className="build-back-icon-fallback">{build.emblem}</span>
              <p>Emblem</p>
            </div>

            <div className="build-back-icon-card">
              <img
                src={getSpellImage(build.battle_spell)}
                alt={build.battle_spell}
                title={build.battle_spell}
                className="build-back-icon-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.querySelector(
                    ".build-back-icon-fallback"
                  ).style.display = "block";
                }}
              />

              <span className="build-back-icon-fallback">
                {build.battle_spell}
              </span>
              <p>Battle Spell</p>
            </div>
          </div>

          <div className="back-items-list">
            {build.build_items.map((item, index) => (
              <p key={`${item}-${index}`}>
                <strong>{index + 1}.</strong> {item}
              </p>
            ))}
          </div>

          <p className="hover-hint">Hover away to return</p>
        </div>
      </div>
    </div>
  );
}

export default BuildCard;