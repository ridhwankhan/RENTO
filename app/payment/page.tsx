'use client';
import { useState } from 'react';

export default function Payment() {
  const [form, setForm] = useState({
    userId: '',
    propertyId: '',
    amount: '',
    method: 'bKash',
    transactionId: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/app/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-red-500 rounded-xl shadow-md space-y-4">
<h2 className="text-2xl font-bold text-white">Payment</h2>
      <h1 className="text-2xl font-bold">Make a Rent Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="userId" placeholder="User ID" className="input" value={form.userId} onChange={handleChange} required />
        <input name="propertyId" placeholder="Property ID" className="input" value={form.propertyId} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount (BDT)" className="input" value={form.amount} onChange={handleChange} required />
        <select name="method" className="input" value={form.method} onChange={handleChange}>
          <option value="bKash">bKash</option>
          <option value="Stripe">Stripe</option>
          <option value="PayPal">PayPal</option>
        </select>
        <input name="transactionId" placeholder="Transaction ID" className="input" value={form.transactionId} onChange={handleChange} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Payment</button>
      </form>
      {message && <p className="mt-4 text-green-600 font-semibold">{message}</p>}
    </div>
  );
}
