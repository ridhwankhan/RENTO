'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Payment {
  id: string;
  userId: string;
  propertyId: string;
  houseId: string;
  flatId: string;
  amount: number;
  method: string;
  transactionId: string;
  status: string;
  timestamp: string;
}

export default function PaymentHistory() {
  // Use useState directly instead of useReducer
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock user ID - in a real app, get this from authentication
  const userId = 'USER123';

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      try {
        // Mock data for testing
        const mockPayments = [
          {
            id: '1',
            userId: 'USER123',
            propertyId: 'PROP001',
            houseId: 'H001',
            flatId: 'F101',
            amount: 15000,
            method: 'bKash',
            transactionId: 'TXN123456',
            status: 'pending',
            timestamp: new Date().toISOString()
          }
        ];

        setPayments(mockPayments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment history');
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading payment history...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Link href="/payment" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Make New Payment
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No payment history found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.propertyId} (House: {payment.houseId}, Flat: {payment.flatId})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ৳{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}





