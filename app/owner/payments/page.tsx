'use client';
import React, { useState, useEffect } from 'react';

export default function OwnerPayments() {
  const [payments, setPayments] = useState([
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
    },
    {
      id: '2',
      userId: 'USER456',
      propertyId: 'PROP001',
      houseId: 'H001',
      flatId: 'F102',
      amount: 18000,
      method: 'Nagad',
      transactionId: 'TXN789012',
      status: 'approved',
      timestamp: new Date(Date.now() - 86400000).toISOString() // Yesterday
    }
  ]);

  const updatePaymentStatus = (id: string, newStatus: string) => {
    setPayments(payments.map(payment =>
      payment.id === id ? { ...payment, status: newStatus } : payment
    ));
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  House: {payment.houseId}, Flat: {payment.flatId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ৳{payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.method} ({payment.transactionId})
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {payment.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => updatePaymentStatus(payment.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
