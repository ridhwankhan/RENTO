'use client';

import { useState, useEffect } from 'react';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  tenantId: string;
  propertyId: string;
  propertyName?: string;
  tenantName?: string;
}

export default function OwnerIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'resolved_requested', 'completed'

  // Mock owner ID - in a real app, this would come from authentication
  const ownerId = 'OWNER123';

  useEffect(() => {
    async function fetchIssues() {
      try {
        // Construct URL with filter if not 'all'
        let url = `/api/issues?ownerId=${ownerId}`;
        if (filter !== 'all') {
          url += `&status=${filter}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch issues');

        const data = await response.json();
        setIssues(data);
      } catch (err) {
        setError('Error loading issues. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [ownerId, filter]);

  async function requestResolution(issueId: string) {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'resolved_requested',
          requesterId: ownerId
        }),
      });

      if (!response.ok) throw new Error('Failed to update issue');

      // Update the local state
      setIssues(issues.map(issue =>
        issue.id === issueId
          ? { ...issue, status: 'resolved_requested' }
          : issue
      ));
    } catch (err) {
      setError('Error updating issue. Please try again.');
      console.error(err);
    }
  }

  // Filter issues based on status
  const filteredIssues = issues;

  if (loading) return <div className="p-6">Loading issues...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Property Issues</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
              }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved_requested')}
            className={`px-4 py-2 rounded ${filter === 'resolved_requested'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
              }`}
          >
            Resolution Requested
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
              }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-gray-500">No issues found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{issue.title}</h2>
                <span className={`px-2 py-1 rounded text-sm ${issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'resolved_requested' ? 'bg-blue-100 text-blue-800' :
                      issue.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100'
                  }`}>
                  {issue.status === 'resolved_requested' ? 'Resolution Requested' :
                    issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
              </div>

              <p className="text-gray-600 mt-2">{issue.description}</p>

              <div className="mt-2 text-sm text-gray-500">
                <p>Property: {issue.propertyName || issue.propertyId}</p>
                <p>Tenant: {issue.tenantName || issue.tenantId}</p>
                <p>Reported on: {new Date(issue.createdAt).toLocaleDateString()}</p>
              </div>

              {issue.status === 'pending' && (
                <div className="mt-4">
                  <button
                    onClick={() => requestResolution(issue.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}

              {issue.status === 'resolved_requested' && (
                <div className="mt-4">
                  <p className="text-blue-600">
                    Waiting for tenant to confirm this issue is resolved.
                  </p>
                </div>
              )}

              {issue.status === 'completed' && (
                <div className="mt-4">
                  <p className="text-green-600">
                    This issue was resolved and confirmed by the tenant.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
