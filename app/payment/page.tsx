'use client';
import React, { useState } from 'react';

export default function Payment() {
  const [form, setForm] = useState({
    userId: '',
    propertyId: '',
    houseId: '',
    flatId: '',
    amount: '',
    method: 'bKash',
    transactionId: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Mock successful payment
    setTimeout(() => {
      setMessage('Payment submitted successfully');
      setLoading(false);
      setForm({
        userId: '',
        propertyId: '',
        houseId: '',
        flatId: '',
        amount: '',
        method: 'bKash',
        transactionId: ''
      });
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Make a Rent Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            name="userId"
            placeholder="Your User ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={form.userId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Property ID</label>
          <input
            name="propertyId"
            placeholder="Property ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={form.propertyId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">House ID</label>
            <input
              name="houseId"
              placeholder="House ID"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={form.houseId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Flat ID</label>
            <input
              name="flatId"
              placeholder="Flat ID"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={form.flatId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (BDT)</label>
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            name="method"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={form.method}
            onChange={handleChange}
          >
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
          <input
            name="transactionId"
            placeholder="Transaction ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={form.transactionId}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 rounded-md bg-green-50 text-green-800">
          {message}
        </div>
      )}
    </div>
  );
}
