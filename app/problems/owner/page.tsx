'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Problem {
  id: number;
  title: string;
  description: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export default function OwnerProblems() {
  // State for problems list and loading status
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for filtering problems
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, completed
  
  // State for property filter
  const [propertyFilter, setPropertyFilter] = useState('');
  
  // State for sending completion request
  const [requestingCompletion, setRequestingCompletion] = useState<number | null>(null);
  const [completionMessage, setCompletionMessage] = useState('');

  // Fetch problems when component mounts
  useEffect(() => {
    fetchProblems();
  }, []);

  // Fetch problems from the API
  const fetchProblems = async () => {
    try {
      // In a real application, you would get the owner ID from authentication
      const ownerId = 'OWNER1';
      const response = await fetch(`/api/problems?ownerId=${ownerId}`);
      
      if (!response.ok) throw new Error('Failed to fetch problems');
      
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  // Update problem status
  const updateProblemStatus = async (id: number, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const response = await fetch(`/api/problems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update problem status');

      const updatedProblem = await response.json();
      setProblems(prevProblems => prevProblems.map(problem => 
        problem.id === updatedProblem.id ? updatedProblem : problem
      ));
      toast.success(`Problem marked as ${status}`);
    } catch (error) {
      console.error('Error updating problem status:', error);
      toast.error('Failed to update problem status');
    }
  };

  // Start the completion request process
  const startCompletionRequest = (id: number) => {
    setRequestingCompletion(id);
    setCompletionMessage('');
  };

  // Cancel the completion request
  const cancelCompletionRequest = () => {
    setRequestingCompletion(null);
    setCompletionMessage('');
  };

  // Send completion request to tenant
  const sendCompletionRequest = async () => {
    if (!requestingCompletion || !completionMessage.trim()) {
      toast.error('Please enter a message for the tenant');
      return;
    }

    try {
      // In a real application, you would send a notification to the tenant
      // For now, we'll just update the problem status to in-progress
      const response = await fetch(`/api/problems/${requestingCompletion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'in-progress',
          // In a real app, you might store this message in a comments/notifications table
        }),
      });

      if (!response.ok) throw new Error('Failed to send completion request');

      const updatedProblem = await response.json();
      setProblems(prevProblems => prevProblems.map(problem => 
        problem.id === updatedProblem.id ? updatedProblem : problem
      ));
      
      setRequestingCompletion(null);
      setCompletionMessage('');
      toast.success('Completion request sent to tenant');
    } catch (error) {
      console.error('Error sending completion request:', error);
      toast.error('Failed to send completion request');
    }
  };

  // Filter problems based on status and property
  let filteredProblems = problems;
  
  // Filter by status
  if (filter !== 'all') {
    filteredProblems = filteredProblems.filter(problem => problem.status === filter);
  }
  
  // Filter by property
  if (propertyFilter) {
    filteredProblems = filteredProblems.filter(problem => 
      problem.propertyId.toLowerCase().includes(propertyFilter.toLowerCase())
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading problems...</div>
      </div>
    );
  }

  // Get unique property IDs for the filter dropdown
  const uniquePropertyIds = Array.from(new Set(problems.map(problem => problem.propertyId)));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Property Problems</h1>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              All Problems
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-md ${filter === 'in-progress' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Completed
            </button>
          </div>
          
          <div className="w-full md:w-64">
            <select
              className="w-full p-2 border rounded"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="">All Properties</option>
              {uniquePropertyIds.map(propertyId => (
                <option key={propertyId} value={propertyId}>
                  {propertyId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Completion Request Form */}
      {requestingCompletion && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Request Tenant to Mark as Completed</h2>
          <div className="space-y-4">
            <textarea
              placeholder="Message to tenant (e.g., 'I've fixed the issue. Please mark as completed if you're satisfied.')"
              className="w-full p-2 border rounded h-24"
              value={completionMessage}
              onChange={(e) => setCompletionMessage(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button
                onClick={sendCompletionRequest}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200"
              >
                Send Request
              </button>
              <button
                onClick={cancelCompletionRequest}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Problems List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Property Problems</h2>
        <div className="space-y-6">
          {filteredProblems.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No problems found
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="border-b pb-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{problem.title}</h3>
                    <p className="text-gray-600 mt-1">{problem.description}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${problem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        problem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {problem.status === 'pending' ? 'Pending' : 
                        problem.status === 'in-progress' ? 'In Progress' : 
                        'Completed'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Property: {problem.propertyId}</span>
                  <span>Tenant ID: {problem.tenantId}</span>
                  <span>Reported: {new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between mt-2 items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${problem.priority === 'low' ? 'bg-gray-100 text-gray-800' : 
                      problem.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {problem.priority.charAt(0).toUpperCase() + problem.priority.slice(1)} Priority
                  </span>
                  
                  <div className="flex gap-2">
                    {problem.status === 'pending' && (
                      <button
                        onClick={() => updateProblemStatus(problem.id, 'in-progress')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200 text-sm"
                      >
                        Mark In Progress
                      </button>
                    )}
                    
                    {problem.status === 'in-progress' && (
                      <button
                        onClick={() => startCompletionRequest(problem.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200 text-sm"
                      >
                        Request Completion
                      </button>
                    )}
                    
                    {problem.status === 'completed' && (
                      <span className="text-green-600 text-sm">
                        Completed on {problem.completedAt ? new Date(problem.completedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
