const cardsData = [
  { image: "/emblems/Assassin.png", title: "Assassin", description: "Fast burst damage role with penetration, physical damage, and movement speed." },
  { image: "/emblems/Basic.png", title: "Basic", description: "Hybrid regeneration boost for HP and mana regeneration." },
  { image: "/emblems/Mage.png", title: "Mage", description: "Magic damage role with magic penetration." },
  { image: "/emblems/Tank.png", title: "Tank", description: "Durable defensive role with extra HP and defenses." },
  { image: "/emblems/Marksman.png", title: "Marksman", description: "High DPS ranged role with attack speed and physical damage." },
  { image: "/emblems/Support.png", title: "Support", description: "Heals and buffs allies." },
  { image: "/emblems/Fighter.png", title: "Fighter", description: "Balanced melee role with spell vamp, hybrid defense, and adaptive attack." },
];

export default function Emblems() {
  return (
    <section>
      <p>
        In Mobile Legends, emblems are customizable stat-boosting systems that
        enhance a hero’s performance in battle.
      </p>

      <div className="maincontainer">
        {cardsData.map(card => (
          <div className="thecard" key={card.title}>
            <div className="thefront">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="theback">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}