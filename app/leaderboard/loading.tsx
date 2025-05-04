export default function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Owner Leaderboard</h1>
      <p className="text-center mb-8 text-gray-600">
        Owners earn 200 points for each resolved issue
      </p>
      
      <div className="text-center p-6">Loading leaderboard...</div>
    </div>
  );
}