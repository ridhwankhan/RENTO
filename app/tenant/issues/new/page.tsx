'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
}

export default function NewIssuePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock tenant ID and properties - in a real app, these would come from authentication and API
  const tenantId = 'TENANT123';
  const properties: Property[] = [
    { id: 'PROP123', name: 'Apartment 101' },
    { id: 'PROP456', name: 'House 202' }
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title || !description || !propertyId) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          propertyId,
          tenantId
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to report issue');
      }

      router.push('/tenant/issues');
    } catch (err: any) {
      setError(err.message || 'Error reporting issue. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/tenant/issues" className="text-blue-500 mr-4">
          &larr; Back to Issues
        </Link>
        <h1 className="text-2xl font-bold">Report New Issue</h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">
            Property
          </label>
          <select
            id="property"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Issue Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Leaking Sink, Broken Heater"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Please describe the issue in detail..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Submitting...' : 'Report Issue'}
        </button>
      </form>
    </div>
  );
}

