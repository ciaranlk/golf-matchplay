
import { useState } from 'react';

export default function App() {
  const [matches, setMatches] = useState([
    { id: 1, team1: 'Team 1', team2: 'Team 2', scores1: Array(18).fill(''), scores2: Array(18).fill('') },
    { id: 2, team1: 'Team 3', team2: 'Team 4', scores1: Array(18).fill(''), scores2: Array(18).fill('') },
    { id: 3, team1: 'Team 5', team2: 'Team 6', scores1: Array(18).fill(''), scores2: Array(18).fill('') },
    { id: 4, team1: 'Team 7', team2: 'Team 8', scores1: Array(18).fill(''), scores2: Array(18).fill('') }
  ]);

  const updateScore = (matchId, hole, team, value) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id !== matchId) return m;
        const updated = { ...m };
        if (team === 1) updated.scores1[hole] = value;
        else updated.scores2[hole] = value;
        return updated;
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

    if (diff === 0 && holesRemaining > 0) return 'AS';
    if (lead > holesRemaining) return `Won ${lead}&${holesRemaining}`;
    if (diff > 0) return `${lead} Up (${holesRemaining} to play)`;
    if (diff < 0) return `${lead} Down (${holesRemaining} to play)`;

    return '';
  };

  return (
    <div>
      <h1>Golf Matchplay Tracker</h1>
      {matches.map((match) => (
        <div key={match.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>{match.team1} vs {match.team2}</h2>
          <p>Status: {getMatchStatus(match.scores1, match.scores2)}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Hole</th>
                <th>{match.team1}</th>
                <th>{match.team2}</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 18 }).map((_, i) => {
                const s1 = parseInt(match.scores1[i]);
                const s2 = parseInt(match.scores2[i]);
                let result = '';
                if (!isNaN(s1) && !isNaN(s2)) {
                  result = s1 < s2 ? match.team1 : s1 > s2 ? match.team2 : 'AS';
                }
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><input type="number" value={match.scores1[i]} onChange={e => updateScore(match.id, i, 1, e.target.value)} /></td>
                    <td><input type="number" value={match.scores2[i]} onChange={e => updateScore(match.id, i, 2, e.target.value)} /></td>
                    <td>{result}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
