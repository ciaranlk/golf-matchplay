import { useState } from "react";

export default function GolfMatchplayApp() {
  const [matches, setMatches] = useState([
    { id: 1, team1: "Team 1", team2: "Team 2", scores1: Array(18).fill(""), scores2: Array(18).fill("") },
    { id: 2, team1: "Team 3", team2: "Team 4", scores1: Array(18).fill(""), scores2: Array(18).fill("") },
    { id: 3, team1: "Team 5", team2: "Team 6", scores1: Array(18).fill(""), scores2: Array(18).fill("") },
    { id: 4, team1: "Team 7", team2: "Team 8", scores1: Array(18).fill(""), scores2: Array(18).fill("") },
  ]);

  const updateScore = (matchId, hole, team, delta) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id !== matchId) return m;
        const updated = { ...m };
        const scores = team === 1 ? [...updated.scores1] : [...updated.scores2];
        const current = parseInt(scores[hole]) || 0;
        scores[hole] = Math.max(1, current + delta); // Minimum score = 1
        if (team === 1) updated.scores1 = scores;
        else updated.scores2 = scores;
        return updated;
      })
    );
  };

  const updateTeamName = (matchId, team, name) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id !== matchId) return m;
        return { ...m, [team]: name };
      })
    );
  };

  const getMatchStatus = (scores1, scores2) => {
    let diff = 0;
    let holesPlayed = 0;

    for (let i = 0; i < 18; i++) {
      const s1 = parseInt(scores1[i]);
      const s2 = parseInt(scores2[i]);
      if (!isNaN(s1) && !isNaN(s2)) {
        holesPlayed++;
        if (s1 < s2) diff++;
        else if (s1 > s2) diff--;
      }
    }

    const holesRemaining = 18 - holesPlayed;
    const lead = Math.abs(diff);

    if (diff === 0 && holesRemaining > 0) return "AS";
    if (lead > holesRemaining) return `Won ${lead}&${holesRemaining}`;
    if (diff > 0) return `${lead} Up (${holesRemaining} to play)`;
    if (diff < 0) return `${lead} Down (${holesRemaining} to play)`;

    return "";
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Golf Matchplay Tracker</h1>
      {matches.map((match, idx) => (
        <div key={match.id} className="mb-6 p-4 border rounded-xl shadow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
            <div className="flex items-center gap-2">
              <input
                className="border p-1 font-semibold w-32"
                value={match.team1}
                onChange={e => updateTeamName(match.id, "team1", e.target.value)}
              />
              <span className="text-gray-500">vs</span>
              <input
                className="border p-1 font-semibold w-32"
                value={match.team2}
                onChange={e => updateTeamName(match.id, "team2", e.target.value)}
              />
            </div>
            <p className="font-medium mt-2 sm:mt-0">Status: {getMatchStatus(match.scores1, match.scores2)}</p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-sm font-medium">
            <div>Hole</div>
            <div>{match.team1}</div>
            <div>{match.team2}</div>
            <div>Result</div>
            {Array.from({ length: 18 }).map((_, hole) => (
              <>
                <div className="text-center">{hole + 1}</div>
                <div className="flex justify-center items-center gap-1">
                  <button className="px-2 border" onClick={() => updateScore(match.id, hole, 1, -1)}>-</button>
                  <span>{match.scores1[hole]}</span>
                  <button className="px-2 border" onClick={() => updateScore(match.id, hole, 1, 1)}>+</button>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <button className="px-2 border" onClick={() => updateScore(match.id, hole, 2, -1)}>-</button>
                  <span>{match.scores2[hole]}</span>
                  <button className="px-2 border" onClick={() => updateScore(match.id, hole, 2, 1)}>+</button>
                </div>
                <div className="text-center">
                  {(() => {
                    const s1 = parseInt(match.scores1[hole]);
                    const s2 = parseInt(match.scores2[hole]);
                    if (!isNaN(s1) && !isNaN(s2)) {
                      if (s1 < s2) return match.team1;
                      if (s1 > s2) return match.team2;
                      return "AS";
                    }
                    return "";
                  })()}
                </div>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
