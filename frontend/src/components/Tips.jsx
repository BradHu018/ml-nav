const lanesData = [
  {
    image: "/lanes/exp.png",
    title: "EXP",
    description:
      "Do not lose too much HP early because enemies can invade your second buff. Around 1:20–1:35, the jungler usually reaches level 4 and can gank. Manage waves carefully: freezing near your tower can force enemies to walk forward, making ganks easier.",
  },
  {
    image: "/lanes/gold.png",
    title: "GOLD",
    description:
      "Around 1:20–1:35, avoid overextending because junglers can gank. During team fights, stay behind your teammates so you can deal damage without getting picked off.",
  },
  {
    image: "/lanes/jungle.png",
    title: "JUNGLE",
    description:
      "Clear jungle quickly and look for gank chances. In solo, duo, or trio queue, farming is often better than forcing fights. Heroes like Ling and Karina spike after their first item, so look for invade chances around objectives.",
  },
  {
    image: "/lanes/mid.png",
    title: "MID",
    description:
      "If your hero lacks mobility early, stay near mid bush to give vision instead of rotating too far. Always check bushes with skills to avoid surprise ganks.",
  },
  {
    image: "/lanes/roam.png",
    title: "ROAM",
    description:
      "Give vision for teammates and rotate with jungle and mid. Do not only babysit gold lane; help create numbers advantages during early fights.",
  },
];

export default function Tips() {
  return (
    <section>
      <h1 className="gradient-text">General Tips</h1>

      <ul className="tips-list">
        <li>Always look at the minimap to know when to engage or back off.</li>
        <li>
          Track important enemy spells like Flicker or Purify. For example, if
          Layla uses Flicker at 2:54, type “Layla F 4:54”.
        </li>
        <li>
          Check your teammates before engaging. If your mage has low mana or
          your marksman has low HP, it may be better not to force a fight.
        </li>
      </ul>

      <h2 className="gradient-text">Lane Guide</h2>

      <div className="secondcontainer">
        {lanesData.map((lane) => (
          <div className="thecard" key={lane.title}>
            <div className="thefront">
              <img src={lane.image} alt={lane.title} />
            </div>

            <div className="theback">
              <h3>{lane.title}</h3>
              <p>{lane.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}