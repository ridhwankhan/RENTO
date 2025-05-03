'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  propertyId: string;
  propertyName?: string;
}

export default function TenantIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock tenant ID - in a real app, this would come from authentication
  const tenantId = 'TENANT123';
  
  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await fetch(`/api/issues?tenantId=${tenantId}`);
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
  }, [tenantId]);
  
  async function markAsCompleted(issueId: string) {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          requesterId: tenantId
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update issue');
      
      // Update the local state
      setIssues(issues.map(issue => 
        issue.id === issueId 
          ? { ...issue, status: 'completed' } 
          : issue
      ));
    } catch (err) {
      setError('Error updating issue. Please try again.');
      console.error(err);
    }
  }
  
  if (loading) return <div className="p-6">Loading issues...</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reported Issues</h1>
        <Link href="/tenant/issues/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          Report New Issue
        </Link>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {issues.length === 0 ? (
        <div className="text-gray-500">You haven't reported any issues yet.</div>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <div key={issue.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{issue.title}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  issue.status === 'resolved_requested' ? 'bg-blue-100 text-blue-800' :
                  issue.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100'
                }`}>
                  {issue.status === 'resolved_requested' ? 'Resolution Requested' : 
                   issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
              </div>
              
              <p className="text-gray-600 mt-2">{issue.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Reported on {new Date(issue.createdAt).toLocaleDateString()}
              </p>
              
              {issue.status === 'resolved_requested' && (
                <div className="mt-4">
                  <p className="text-blue-600 mb-2">
                    The owner has requested you to confirm this issue is resolved.
                  </p>
                  <button
                    onClick={() => markAsCompleted(issue.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Confirm Issue is Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}