const cardsData = [
  { image: "/embls/assasin.png", title: "Assassin", description: "Fast burst damage role with penetration, physical damage, and movement speed." },
  { image: "/embls/basic.png", title: "Basic", description: "Hybrid regeneration boost for HP and mana regeneration." },
  { image: "/embls/mage.png", title: "Mage", description: "Magic damage role with magic penetration." },
  { image: "/embls/tank.png", title: "Tank", description: "Durable defensive role with extra HP and defenses." },
  { image: "/embls/marksman.png", title: "Marksman", description: "High DPS ranged role with attack speed and physical damage." },
  { image: "/embls/support.png", title: "Support", description: "Heals and buffs allies." },
  { image: "/embls/fighter.png", title: "Fighter", description: "Balanced melee role with spell vamp, hybrid defense, and adaptive attack." },
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