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

export default function TenantProblems() {
  // State for problems list and loading status
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for new problem form
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    propertyId: '',
    priority: 'medium'
  });
  
  // State for editing a problem
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: ''
  });

  // State for filtering problems
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, completed

  // Fetch problems when component mounts
  useEffect(() => {
    fetchProblems();
  }, []);

  // Fetch problems from the API
  const fetchProblems = async () => {
    try {
      // In a real application, you would get the tenant ID from authentication
      const tenantId = 'TENANT1';
      const response = await fetch(`/api/problems?tenantId=${tenantId}`);
      
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

  // Handle new problem form submission
  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newProblem.title,
          description: newProblem.description,
          propertyId: newProblem.propertyId,
          priority: newProblem.priority,
          // In a real application, you would get these IDs from authentication/context
          tenantId: 'TENANT1',
          ownerId: 'OWNER1'
        }),
      });

      if (!response.ok) throw new Error('Failed to submit problem');

      const newProblemData = await response.json();
      setProblems(prevProblems => [newProblemData, ...prevProblems]);
      setNewProblem({ title: '', description: '', propertyId: '', priority: 'medium' });
      toast.success('Problem reported successfully');
    } catch (error) {
      console.error('Error submitting problem:', error);
      toast.error('Failed to report problem');
    }
  };

  // Start editing a problem
  const startEditing = (problem: Problem) => {
    setEditingProblem(problem);
    setEditForm({
      title: problem.title,
      description: problem.description,
      priority: problem.priority
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProblem(null);
    setEditForm({ title: '', description: '', priority: '' });
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    try {
      const response = await fetch(`/api/problems/${editingProblem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority
        }),
      });

      if (!response.ok) throw new Error('Failed to update problem');

      const updatedProblem = await response.json();
      setProblems(prevProblems => prevProblems.map(problem => 
        problem.id === updatedProblem.id ? updatedProblem : problem
      ));
      setEditingProblem(null);
      setEditForm({ title: '', description: '', priority: '' });
      toast.success('Problem updated successfully');
    } catch (error) {
      console.error('Error updating problem:', error);
      toast.error('Failed to update problem');
    }
  };

  // Handle problem deletion
  const handleDeleteProblem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return;
    }

    try {
      const response = await fetch(`/api/problems/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete problem');

      setProblems(prevProblems => prevProblems.filter(problem => problem.id !== id));
      toast.success('Problem deleted successfully');
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error('Failed to delete problem');
    }
  };

  // Mark a problem as completed
  const markAsCompleted = async (id: number) => {
    try {
      const response = await fetch(`/api/problems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed'
        }),
      });

      if (!response.ok) throw new Error('Failed to update problem');

      const updatedProblem = await response.json();
      setProblems(prevProblems => prevProblems.map(problem => 
        problem.id === updatedProblem.id ? updatedProblem : problem
      ));
      toast.success('Problem marked as completed');
    } catch (error) {
      console.error('Error updating problem:', error);
      toast.error('Failed to mark problem as completed');
    }
  };

  // Filter problems based on status
  const filteredProblems = filter === 'all' 
    ? problems 
    : problems.filter(problem => problem.status === filter);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Report Property Problems</h1>
      
      {/* New Problem Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Report a New Problem</h2>
        <form onSubmit={handleProblemSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Problem Title"
              className="w-full p-2 border rounded"
              value={newProblem.title}
              onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Describe the problem in detail"
              className="w-full p-2 border rounded h-24"
              value={newProblem.description}
              onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Property ID"
              className="w-full p-2 border rounded"
              value={newProblem.propertyId}
              onChange={(e) => setNewProblem({...newProblem, propertyId: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Priority</label>
            <select
              className="w-full p-2 border rounded"
              value={newProblem.priority}
              onChange={(e) => setNewProblem({...newProblem, priority: e.target.value as 'low' | 'medium' | 'high'})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Submit Problem
          </button>
        </form>
      </div>

      {/* Edit Problem Form */}
      {editingProblem && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Problem</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Problem Title"
                className="w-full p-2 border rounded"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Describe the problem in detail"
                className="w-full p-2 border rounded h-24"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Priority</label>
              <select
                className="w-full p-2 border rounded"
                value={editForm.priority}
                onChange={(e) => setEditForm({...editForm, priority: e.target.value as 'low' | 'medium' | 'high'})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Update Problem
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
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
      </div>

      {/* Problems List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Reported Problems</h2>
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
                    {problem.status !== 'completed' && (
                      <button
                        onClick={() => markAsCompleted(problem.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200 text-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                    
                    {problem.status !== 'completed' && (
                      <button
                        onClick={() => startEditing(problem)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200 text-sm"
                      >
                        Edit
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteProblem(problem.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200 text-sm"
                    >
                      Delete
                    </button>
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
