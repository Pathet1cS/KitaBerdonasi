import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AssociationDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://localhost:5000/association/donations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }

        const data = await response.json();
        setDonations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonations();
    }
}, [token]);

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/association/donations/${donationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setDonations(donations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: newStatus }
          : donation
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Donasi</h2>
        <div className="flex gap-4">
          <select className="p-2 border rounded">
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Diterima</option>
            <option value="completed">Selesai</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded"
            placeholder="Filter by date"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Donatur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Jumlah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4">
                  <div className="text-sm">{donation.donor_name}</div>
                  <div className="text-sm text-gray-500">{donation.donor_email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{donation.item_name}</div>
                  <div className="text-sm text-gray-500">{donation.description}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {donation.quantity}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(donation.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    donation.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {donation.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'accepted')}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Terima
                    </button>
                  )}
                  {donation.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'completed')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Selesai
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssociationDashboard;