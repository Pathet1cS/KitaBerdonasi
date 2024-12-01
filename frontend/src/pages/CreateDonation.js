import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateDonation = () => {
  const [associations, setAssociations] = useState([]);
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    quantity: '',
    association_id: '',
  });
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await fetch('http://localhost:5000/associations');
        const data = await response.json();
        setAssociations(data);
      } catch (err) {
        setError('Failed to load associations');
      }
    };

    fetchAssociations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Buat Donasi Baru</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Nama Barang</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.item_name}
            onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Deskripsi</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Jumlah</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Pilih Asosiasi</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.association_id}
            onChange={(e) => setFormData({ ...formData, association_id: e.target.value })}
          >
            <option value="">Pilih Asosiasi</option>
            {associations.map((association) => (
              <option key={association.id} value={association.id}>
                {association.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Buat Donasi
        </button>
      </form>
    </div>
  );
};

export default CreateDonation