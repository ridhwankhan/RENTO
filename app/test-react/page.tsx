'use client';
import React, { useState } from 'react';

export default function TestReact() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">React Test Page</h1>
      <p className="mb-4">Count: {count}</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}