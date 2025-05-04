'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Owner Leaderboard</h1>
      
      <div className="bg-red-100 text-red-700 p-6 rounded mb-4 text-center">
        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
        <p className="mb-4">Failed to load the leaderboard data.</p>
        <button
          onClick={reset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}