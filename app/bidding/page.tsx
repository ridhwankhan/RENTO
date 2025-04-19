'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Bid {
  id: number;
  propertyId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export default function RentBidding() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBid, setNewBid] = useState({
    propertyId: '',
    amount: ''
  });
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [editForm, setEditForm] = useState({
    propertyId: '',
    amount: ''
  });

  // Fetch bids when component mounts
  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await fetch('/api/bids');
      if (!response.ok) throw new Error('Failed to fetch bids');
      const data = await response.json();
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: newBid.propertyId,
          amount: parseFloat(newBid.amount),
          // You might want to get userId from authentication context
          userId: 'USER123',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit bid');

      const newBidData = await response.json();
      setBids(prevBids => [...prevBids, newBidData]);
      setNewBid({ propertyId: '', amount: '' });
      toast.success('Bid submitted successfully');
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid');
    }
  };

  const startEditing = (bid: Bid) => {
    setEditingBid(bid);
    setEditForm({
      propertyId: bid.propertyId,
      amount: bid.amount.toString()
    });
  };

  const cancelEditing = () => {
    setEditingBid(null);
    setEditForm({ propertyId: '', amount: '' });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBid) return;

    try {
      const response = await fetch(`/api/bids/${editingBid.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: editForm.propertyId,
          amount: parseFloat(editForm.amount),
        }),
      });

      if (!response.ok) throw new Error('Failed to update bid');

      const updatedBid = await response.json();
      setBids(prevBids => prevBids.map(bid =>
        bid.id === updatedBid.id ? updatedBid : bid
      ));
      setEditingBid(null);
      setEditForm({ propertyId: '', amount: '' });
      toast.success('Bid updated successfully');
    } catch (error) {
      console.error('Error updating bid:', error);
      toast.error('Failed to update bid');
    }
  };

  const handleDeleteBid = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this bid?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bids/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete bid');

      setBids(prevBids => prevBids.filter(bid => bid.id !== id));
      toast.success('Bid deleted successfully');
    } catch (error) {
      console.error('Error deleting bid:', error);
      toast.error('Failed to delete bid');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading bids...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rent Bidding</h1>

      {/* New Bid Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Place a New Bid</h2>
        <form onSubmit={handleBidSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Property ID"
              className="w-full p-2 border rounded"
              value={newBid.propertyId}
              onChange={(e) => setNewBid({...newBid, propertyId: e.target.value})}
              required
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Bid Amount (BDT)"
              className="w-full p-2 border rounded"
              value={newBid.amount}
              onChange={(e) => setNewBid({...newBid, amount: e.target.value})}
              required
              min="0"
              step="100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Submit Bid
          </button>
        </form>
      </div>

      {/* Edit Bid Form */}
      {editingBid && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Bid</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Property ID"
                className="w-full p-2 border rounded"
                value={editForm.propertyId}
                onChange={(e) => setEditForm({...editForm, propertyId: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Bid Amount (BDT)"
                className="w-full p-2 border rounded"
                value={editForm.amount}
                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                required
                min="0"
                step="100"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Update Bid
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

      {/* Existing Bids */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Bids</h2>
        <div className="space-y-4">
          {bids.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No bids placed yet
            </div>
          ) : (
            bids.map((bid) => (
              <div
                key={bid.id}
                className="border-b pb-4"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">Property ID: {bid.propertyId}</span>
                  <span className={`
                    ${bid.status === 'accepted' ? 'text-green-600' :
                      bid.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'}
                  `}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Amount: ৳{bid.amount.toLocaleString()}</span>
                  <span className="text-gray-500">{new Date(bid.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => startEditing(bid)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBid(bid.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
