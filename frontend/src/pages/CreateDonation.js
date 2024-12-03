import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateDonation = () => {
  const [associations, setAssociations] = useState([]);
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    quantity: '',
    association_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await fetch('http://localhost:5000/associations');
        const data = await response.json();
        console.log('Available associations:', data); // Debugging
        setAssociations(data);
      } catch (err) {
        console.error('Error fetching associations:', err);
        setError('Failed to load associations');
      }
    };

    fetchAssociations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi
    if (!formData.item_name || !formData.description || !formData.quantity || !formData.association_id) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    // Persiapkan data yang akan dikirim
    const donationData = {
      item_name: formData.item_name.toString(), // Pastikan string
      description: formData.description.toString(), // Pastikan string
      quantity: parseInt(formData.quantity), // Konversi ke number
      association_id: parseInt(formData.association_id) // Konversi ke number
    };

    try {
      console.log('Sending donation data:', donationData); // Debugging

      const response = await fetch('http://localhost:5000/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(donationData)
      });
      
      const responseData = await response.json();
      console.log('Response:', response.status, responseData); // Debugging

      if (response.ok) {
        navigate('/dashboard');
      } else {
        throw new Error(responseData.error || 'Failed to create donation');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Buat Donasi Baru</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Nama Barang</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.item_name}
            onChange={(e) => setFormData({ ...formData, item_name: e.target.value.trim() })}
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Deskripsi</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value.trim() })}
            rows="4"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Jumlah</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            min="1"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Pilih Asosiasi</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.association_id}
            onChange={(e) => setFormData({ ...formData, association_id: e.target.value })}
            required
          >
            <option value="">Pilih Asosiasi</option>
            {associations.map((association) => (
              <option key={association.id} value={association.id}>
                {association.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded ${
            loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Sedang Membuat...' : 'Buat Donasi'}
        </button>
      </form>
    </div>
  );
};

export default CreateDonation;