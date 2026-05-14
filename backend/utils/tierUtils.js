function calculateHeroScore(winRate, pickRate, banRate) {
  const win = Number(winRate);
  const pick = Number(pickRate);
  const ban = Number(banRate);

  const normalizedWinRate = Math.min(Math.max((win - 45) * 10, 0), 100);
  const normalizedPickRate = Math.min(pick * 10, 100);
  const normalizedBanRate = Math.min(ban * 2, 100);

  const score =
    normalizedBanRate * 0.45 +
    normalizedPickRate * 0.3 +
    normalizedWinRate * 0.25;

  return Number(score.toFixed(2));
}

function getTier(winRate, pickRate, banRate, score) {
  const win = Number(winRate);
  const pick = Number(pickRate);
  const ban = Number(banRate);

  /*
    S-Tier:
    Must-pick/ban heroes.
    These heroes are either extremely banned, or they combine strong win rate
    with major ban pressure.
  */
  if (
    (win >= 55 && ban >= 45) ||
    ban >= 70 ||
    score >= 78
  ) {
    return "S";
  }

  /*
    A-Tier:
    Strong meta heroes.
    These heroes are picked/banned enough to matter and have a stable or good win rate.
    This should catch heroes like Leomord, YSS, and Suyou if their stats are strong.
  */
  if (
    (win >= 52 && ban >= 20) ||
    (win >= 51 && pick >= 5) ||
    (pick >= 8 && win >= 49.5) ||
    score >= 58
  ) {
    return "A";
  }

  /*
    B-Tier:
    Good or situational heroes.
    They are not dominant, but they are playable and can work in the right draft.
  */
  if (
    (win >= 49 && pick >= 2) ||
    (win >= 50 && ban >= 5) ||
    score >= 38
  ) {
    return "B";
  }

  /*
    C-Tier:
    Weak or outclassed heroes.
    Low win rate or very little meta presence.
  */
  return "C";
}

module.exports = {
  calculateHeroScore,
  getTier,
};