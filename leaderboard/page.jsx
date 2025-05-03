// src/pages/Leaderboard.jsx
import React from "react";
import "./Leaderboard.css"; // optional custom CSS for glowing effects

const mockLeaderboard = [
  { rank: 1, name: "Alice", score: 950, team: "ByteBusters" },
  { rank: 2, name: "Bob", score: 900, team: "CyberKnights" },
  { rank: 3, name: "Charlie", score: 870, team: "RootRunners" },
  { rank: 4, name: "David", score: 800, team: "NullNinjas" },
  { rank: 5, name: "Eve", score: 750, team: "RedReboot" },
  // ...more users
];

const Leaderboard = () => {
  return (
    <div className="p-6 text-white bg-black min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-cyan-400 glow">🏆 Rent Leaderboard</h1>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full border-collapse text-center leaderboard-table">
          <thead>
            <tr className="text-cyan-300 text-lg border-b border-cyan-600">
              <th className="py-4">Rank</th>
              <th>Name</th>
              <th>Team</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((user, index) => (
              <tr
                key={user.rank}
                className={`hover:bg-cyan-900/10 transition-all ${
                  user.rank === 1
                    ? "text-yellow-400"
                    : user.rank === 2
                    ? "text-gray-300"
                    : user.rank === 3
                    ? "text-orange-400"
                    : "text-white"
                }`}
              >
                <td className="py-3">{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.team}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
