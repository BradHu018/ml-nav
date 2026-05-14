const { calculateHeroScore, getTier } = require("../utils/tierUtils");

const HERO_STATS_URL =
  "https://raw.githubusercontent.com/Pren7/MLBB-Winrate/refs/heads/main/winrate.json";

function parseRate(rate) {
  return parseFloat(String(rate).replace("%", "")) || 0;
}

async function getTierList(req, res) {
  try {
    const response = await fetch(HERO_STATS_URL);

    if (!response.ok) {
      return res.status(502).json({
        message: "Failed to fetch hero stats source",
      });
    }

    const rawHeroes = await response.json();

    const rankedHeroes = rawHeroes.map((hero) => {
      const winRate = parseRate(hero.winrate);
      const pickRate = parseRate(hero.pickrate);
      const banRate = parseRate(hero.banrate);

      const score = calculateHeroScore(winRate, pickRate, banRate);
      const tier = getTier(winRate, pickRate, banRate, score);

      return {
        hero_name: hero.name,
        image: hero.icon,
        win_rate: winRate,
        pick_rate: pickRate,
        ban_rate: banRate,
        score,
        tier,
      };
    });

    const tierOrder = {
      S: 1,
      A: 2,
      B: 3,
      C: 4,
      D: 5,
    };

    rankedHeroes.sort((a, b) => {
      if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[a.tier] - tierOrder[b.tier];
      }

      return b.score - a.score;
    });

    res.status(200).json({
      heroes: rankedHeroes,
    });
  } catch (error) {
    console.error("Get tier list error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  getTierList,
};