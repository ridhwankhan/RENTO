// src/pages/Leaderboard.jsx
import React from "react";
import "./Leaderboard.css"; // optional custom CSS for glowing effects

const mockLeaderboard = [
  { rank: 1, name: "Alice", score: 950 },
  { rank: 2, name: "Bob", score: 900 },
  { rank: 3, name: "Charlie", score: 870 },
  { rank: 4, name: "David", score: 800 },
  { rank: 5, name: "Eve", score: 750 },
  { rank: 6, name: "Frank", score: 720 },
  { rank: 7, name: "Grace", score: 690 },
  { rank: 8, name: "Henry", score: 650 },
  { rank: 9, name: "Isabel", score: 630 },
  { rank: 10, name: "Jack", score: 600 },
  { rank: 11, name: "Kelly", score: 580 },
  { rank: 12, name: "Liam", score: 550 },
  { rank: 13, name: "Mia", score: 520 },
  { rank: 14, name: "Noah", score: 500 },
  { rank: 15, name: "Olivia", score: 480 }
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
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((user) => (
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
